import { DoctorUser } from '../types';

export interface AuthorizedDoctor extends DoctorUser {
  password: string;
  pin: string;
  roomNumber: string;
  qualifications: string;
  hospitalName: string;
  avatarInitials: string;
}

export const AUTHORIZED_DOCTORS: AuthorizedDoctor[] = [
  {
    id: 'doc-1',
    doctorId: 'DOC-AIIMS-409',
    name: 'Dr. Rajesh Sharma, MD (Medicine)',
    specialization: 'Internal Medicine & Integrative AYUSH Health',
    department: 'General OPD Room 04',
    email: 'dr.sharma@hospital.gov.in',
    role: 'DOCTOR',
    tokenCountToday: 24,
    password: 'doc409password',
    pin: '4090',
    roomNumber: 'Room 04 (Ground Floor)',
    qualifications: 'MBBS, MD (Medicine), PG Dip. in Integrative Medicine',
    hospitalName: 'AIIMS / District Civil Hospital',
    avatarInitials: 'RS',
  },
  {
    id: 'doc-2',
    doctorId: 'DOC-AYUSH-108',
    name: 'Dr. Ananya Sen, MD (Ayurveda)',
    specialization: 'Kayachikitsa & Panchakarma Specialist',
    department: 'AYUSH Integrative OPD Room 07',
    email: 'dr.ananya@hospital.gov.in',
    role: 'DOCTOR',
    tokenCountToday: 19,
    password: 'ayush108password',
    pin: '1080',
    roomNumber: 'Room 07 (AYUSH Wing)',
    qualifications: 'BAMS, MD (Ayurveda - Kayachikitsa), CRAV',
    hospitalName: 'National AYUSH Research Hospital',
    avatarInitials: 'AS',
  },
  {
    id: 'doc-3',
    doctorId: 'DOC-AIIMS-215',
    name: 'Dr. Vikramaditya Rathore, MS (Ortho)',
    specialization: 'Joints, Spine & Marma Therapy Specialist',
    department: 'Orthopaedics & Marma Clinic Room 12',
    email: 'dr.vikram@hospital.gov.in',
    role: 'DOCTOR',
    tokenCountToday: 15,
    password: 'ortho215password',
    pin: '2150',
    roomNumber: 'Room 12 (Surgical Block)',
    qualifications: 'MBBS, MS (Orthopaedics), Certified Marma Practitioner',
    hospitalName: 'District Civil & Trauma Hospital',
    avatarInitials: 'VR',
  },
];
