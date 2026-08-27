import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { ocrService } from './server/ocr.js';
import { evaluateTriage } from './server/triage.js';
import { generateClinicalSummary } from './server/gemini.js';
import { Patient, PatientSession, ConsultationRecord, TimelineEvent } from './src/types/index.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // ==========================================
  // API ROUTES
  // ==========================================

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'SwasthaVedic AI Backend', time: new Date().toISOString() });
  });

  // Patient Search (Mobile, Patient Code, or ABHA ID)
  app.post('/api/patients/search', (req, res) => {
    const { mobile, patientCode, abhaId } = req.body;
    let foundPatient: Patient | undefined;

    for (const p of db.patients.values()) {
      if (mobile && p.mobile === mobile.trim()) {
        foundPatient = p;
        break;
      }
      if (patientCode && p.patientCode.toUpperCase() === patientCode.trim().toUpperCase()) {
        foundPatient = p;
        break;
      }
      if (abhaId && p.abhaId === abhaId.trim()) {
        foundPatient = p;
        break;
      }
    }

    if (foundPatient) {
      // Get previous clinical history if available
      let pastHistory = null;
      for (const [key, history] of db.clinicalHistories.entries()) {
        pastHistory = history;
      }

      res.json({
        found: true,
        patient: foundPatient,
        pastHistory,
      });
    } else {
      res.json({ found: false, message: 'No existing patient record found.' });
    }
  });

  // Patient Registration
  app.post('/api/patients/register', (req, res) => {
    const data = req.body;
    const newId = `pat-${Date.now()}`;
    const patientCode = `SV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPatient: Patient = {
      id: newId,
      patientCode,
      name: data.name || 'Anonymous Patient',
      age: Number(data.age) || 30,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender || 'OTHER',
      mobile: data.mobile || '',
      abhaId: data.abhaId || '',
      preferredLanguage: data.preferredLanguage || 'hi',
      address: data.address || '',
      emergencyContact: data.emergencyContact || '',
      isExistingPatient: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.patients.set(newId, newPatient);
    res.json({ success: true, patient: newPatient });
  });

  // Create Patient Kiosk Session
  app.post('/api/sessions/create', (req, res) => {
    const { patientId, language, accessibilityMode, isAttendantPresent, attendantName } = req.body;
    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const visitId = `visit-${Date.now()}`;
    const tokenNumber = `#OPD-${100 + db.queue.length + 1}`;

    const session: PatientSession = {
      sessionId,
      patientId,
      visitId,
      tokenNumber,
      language: (language as any) || 'hi',
      accessibilityMode: (accessibilityMode as any) || 'NORMAL',
      isAttendantPresent: !!isAttendantPresent,
      attendantName,
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };

    db.sessions.set(sessionId, session);
    res.json({ success: true, session });
  });

  // Get Patient Medical Timeline
  app.get('/api/patients/:patientId/timeline', (req, res) => {
    const { patientId } = req.params;
    const timeline = db.timelines.get(patientId) || [];
    let pastHistory = null;
    for (const [key, history] of db.clinicalHistories.entries()) {
      pastHistory = history;
    }

    res.json({ timeline, pastHistory });
  });

  // Submit Clinical History from Kiosk
  app.post('/api/history/submit', async (req, res) => {
    try {
      const { sessionId, patientId, visitId, clinicalHistory } = req.body;
      const patient = db.patients.get(patientId);

      // Save clinical history
      db.clinicalHistories.set(visitId, clinicalHistory);

      // Evaluate Triage Rules for Red Flags
      const session = db.sessions.get(sessionId);
      const tokenNumber = session ? session.tokenNumber : `#OPD-${100 + db.queue.length + 1}`;
      const triageAlerts = evaluateTriage(patientId, visitId, tokenNumber, clinicalHistory);
      if (triageAlerts.length > 0) {
        db.triageAlerts.set(visitId, triageAlerts);
      }

      // Determine highest severity
      let highestSeverity: 'NORMAL' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'NORMAL';
      for (const alert of triageAlerts) {
        if (alert.severity === 'HIGH' || alert.severity === 'CRITICAL') {
          highestSeverity = alert.severity;
          break;
        } else if (alert.severity === 'MEDIUM' && highestSeverity === 'NORMAL') {
          highestSeverity = 'MEDIUM';
        }
      }

      // Generate initial AI clinical summary
      const aiSummary = await generateClinicalSummary({
        chiefComplaints: clinicalHistory.chiefComplaints,
        clinicalHistory,
      });

      // Add to Today's Doctor Queue
      const queueItem = {
        tokenNumber,
        visitId,
        patientId,
        patientName: patient ? patient.name : 'OPD Patient',
        age: patient ? patient.age : 35,
        gender: patient ? patient.gender : 'OTHER',
        chiefComplaint:
          clinicalHistory.chiefComplaints && clinicalHistory.chiefComplaints.length > 0
            ? clinicalHistory.chiefComplaints.map((c: any) => c.symptom).join(', ')
            : 'General Checkup',
        severity: highestSeverity,
        status: 'READY' as const,
        arrivalTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      // Put HIGH severity triage items at top of queue
      if (highestSeverity === 'HIGH' || highestSeverity === 'CRITICAL') {
        db.queue.unshift(queueItem);
      } else {
        db.queue.push(queueItem);
      }

      // Add timeline event
      const existingTimeline = db.timelines.get(patientId) || [];
      existingTimeline.unshift({
        id: `tl-kiosk-${Date.now()}`,
        patientId,
        date: new Date().toISOString().split('T')[0],
        eventType: 'CONSULTATION',
        title: `OPD Visit Registered (${tokenNumber})`,
        description: `Chief complaint: ${queueItem.chiefComplaint}. Recorded via SwasthaVedic Kiosk.`,
      });
      db.timelines.set(patientId, existingTimeline);

      res.json({
        success: true,
        tokenNumber,
        visitId,
        triageAlerts,
        aiSummary,
      });
    } catch (err: any) {
      console.error('Error submitting history:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // OCR Document Upload & Extraction
  app.post('/api/documents/ocr-upload', async (req, res) => {
    try {
      const { fileName, fileData, mimeType, patientId, visitId } = req.body;
      const buffer = fileData ? Buffer.from(fileData.replace(/^data:image\/\w+;base64,/, ''), 'base64') : Buffer.from('mock');

      const extractedDoc = await ocrService.extractDocument(
        buffer,
        fileName || 'Prescription_Document.jpg',
        mimeType || 'image/jpeg',
        patientId || 'pat-demo',
        visitId || 'visit-demo'
      );

      const patientDocs = db.documents.get(patientId) || [];
      patientDocs.push(extractedDoc);
      db.documents.set(patientId, patientDocs);

      // Add document upload to timeline
      if (patientId) {
        const timeline = db.timelines.get(patientId) || [];
        timeline.unshift({
          id: `tl-doc-${Date.now()}`,
          patientId,
          date: new Date().toISOString().split('T')[0],
          eventType: 'DOCUMENT_UPLOAD',
          title: `Document Digitized (${extractedDoc.title})`,
          description: `OCR processed ${extractedDoc.entities.length} clinical items with ${(extractedDoc.ocrConfidence * 100).toFixed(0)}% confidence.`,
        });
        db.timelines.set(patientId, timeline);
      }

      res.json({
        success: true,
        document: extractedDoc,
        extractedSummary: extractedDoc.extractedText,
      });
    } catch (err: any) {
      console.error('OCR error:', err);
      res.status(500).json({ error: 'Failed to process document OCR' });
    }
  });

  // Staff Assistance Requests
  app.post('/api/assistance/request', (req, res) => {
    const { kioskId, patientName, tokenNumber, language, reason } = req.body;
    const request = {
      id: `req-${Date.now()}`,
      kioskId: kioskId || 'Kiosk #01',
      patientName,
      tokenNumber,
      language: (language as any) || 'hi',
      reason: reason || 'Assistance requested by patient',
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    };

    db.assistanceRequests.unshift(request);
    res.json({ success: true, request });
  });

  app.get('/api/assistance/list', (req, res) => {
    res.json({ requests: db.assistanceRequests });
  });

  app.post('/api/assistance/:id/resolve', (req, res) => {
    const { id } = req.params;
    const { resolvedBy } = req.body;
    const reqItem = db.assistanceRequests.find((r) => r.id === id);
    if (reqItem) {
      reqItem.status = 'RESOLVED';
      reqItem.resolvedAt = new Date().toISOString();
      reqItem.resolvedBy = resolvedBy || 'OPD Attendant';
    }
    res.json({ success: true, requests: db.assistanceRequests });
  });

  // Doctor Queue
  app.get('/api/doctor/queue', (req, res) => {
    res.json({ queue: db.queue });
  });

  app.post('/api/doctor/queue/:visitId/status', (req, res) => {
    const { visitId } = req.params;
    const { status } = req.body;
    const item = db.queue.find((q) => q.visitId === visitId);
    if (item) {
      item.status = status;
    }
    res.json({ success: true, queue: db.queue });
  });

  // Doctor Patient Full Clinical Bundle
  app.get('/api/doctor/patient-bundle/:visitId', (req, res) => {
    const { visitId } = req.params;
    const queueItem = db.queue.find((q) => q.visitId === visitId);
    const patientId = queueItem ? queueItem.patientId : 'pat-101';
    const patient = db.patients.get(patientId);
    const clinicalHistory = db.clinicalHistories.get(visitId) || db.clinicalHistories.get('visit-prev-101');
    const triageAlerts = db.triageAlerts.get(visitId) || [];
    const documents = db.documents.get(patientId) || [];
    const timeline = db.timelines.get(patientId) || [];
    const previousConsultations = Array.from(db.consultations.values()).filter((c) => c.patientId === patientId);

    res.json({
      patient,
      queueItem,
      clinicalHistory,
      triageAlerts,
      documents,
      timeline,
      previousConsultations,
    });
  });

  // Save Consultation (Draft / Finalized)
  app.post('/api/consultations/save', (req, res) => {
    const data = req.body;
    const consultationId = data.id || `cons-${Date.now()}`;
    const consultation: ConsultationRecord = {
      id: consultationId,
      visitId: data.visitId,
      patientId: data.patientId,
      doctorId: data.doctorId || 'doc-1',
      doctorName: data.doctorName || 'Dr. Rajesh Sharma',
      department: data.department || 'General OPD',
      consultationDate: new Date().toISOString(),
      symptomsSummary: data.symptomsSummary || '',
      aiClinicalSummary: data.aiClinicalSummary,
      provisionalDiagnosis: data.provisionalDiagnosis || '',
      finalDiagnosis: data.finalDiagnosis || '',
      icdCode: data.icdCode,
      systemicExamination: data.systemicExamination || '',
      ayushAssessment: data.ayushAssessment,
      prescriptions: data.prescriptions || [],
      investigations: data.investigations || [],
      generalAdvice: data.generalAdvice || '',
      followUpDays: data.followUpDays,
      followUpDate: data.followUpDate,
      isEmergencyReferral: !!data.isEmergencyReferral,
      status: data.status || 'FINALIZED',
      finalizedAt: data.status === 'FINALIZED' ? new Date().toISOString() : undefined,
    };

    db.consultations.set(data.visitId, consultation);

    // If finalized, mark queue item completed and append to timeline
    if (data.status === 'FINALIZED') {
      const qItem = db.queue.find((q) => q.visitId === data.visitId);
      if (qItem) {
        qItem.status = 'COMPLETED';
      }

      const timeline = db.timelines.get(data.patientId) || [];
      timeline.unshift({
        id: `tl-final-${Date.now()}`,
        patientId: data.patientId,
        date: new Date().toISOString().split('T')[0],
        eventType: 'CONSULTATION',
        title: `Consultation Finalized (${consultation.finalDiagnosis || consultation.provisionalDiagnosis || 'OPD Review'})`,
        description: `Prescribed ${consultation.prescriptions.length} medication(s) and ${consultation.investigations.length} lab investigation(s).`,
        doctorName: consultation.doctorName,
        department: consultation.department,
      });
      db.timelines.set(data.patientId, timeline);
    }

    res.json({ success: true, consultation });
  });

  // AI Clinical Summary Endpoint
  app.post('/api/ai/clinical-summary', async (req, res) => {
    try {
      const summary = await generateClinicalSummary(req.body);
      res.json({ summary });
    } catch (err: any) {
      res.status(500).json({ error: 'AI summarization error' });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE SETUP
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SwasthaVedic AI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
