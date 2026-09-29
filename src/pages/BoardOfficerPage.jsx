import React from 'react';
import { UsersRound } from 'lucide-react';
import { PeopleDirectoryPage } from './BoardPage';
import { COOP_INFO, STAFF_MEMBERS } from '../data/mockData';

export default function BoardOfficerPage() {
  return (
    <PeopleDirectoryPage
      badge="ฝ่ายจัดการ"
      title="ฝ่ายจัดการและเจ้าหน้าที่"
      subtitle={`รายชื่อฝ่ายจัดการและเจ้าหน้าที่ ${COOP_INFO.nameTh}`}
      heading="ฝ่ายจัดการและเจ้าหน้าที่"
      Icon={UsersRound}
      members={STAFF_MEMBERS}
      type="staff"
    />
  );
}
