import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as BsIcons from 'react-icons/bs';

export const SidebarData = [
  {
    title: 'Persons',
    path: '/persons',
    icon: <BsIcons.BsPeopleFill />,
    cName: 'nav-text'
  },
  {
    title: 'Cars',
    path: '/cars',
    icon: <FaIcons.FaCar />,
    cName: 'nav-text'
  },
];
