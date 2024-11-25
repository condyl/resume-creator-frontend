
import React from 'react';

const PersonalInfo = ({ personalInfo, handleChange }) => (
  <div>
    <h2>Personal Information</h2>
    <input type="text" name="name" placeholder="Name" value={personalInfo.name} onChange={(e) => handleChange(e, null, 'personalInfo', 'name')} />
    <input type="email" name="email" placeholder="Email" value={personalInfo.email} onChange={(e) => handleChange(e, null, 'personalInfo', 'email')} />
    <input type="text" name="github" placeholder="GitHub" value={personalInfo.github} onChange={(e) => handleChange(e, null, 'personalInfo', 'github')} />
    <input type="text" name="linkedin" placeholder="LinkedIn" value={personalInfo.linkedin} onChange={(e) => handleChange(e, null, 'personalInfo', 'linkedin')} />
    <input type="text" name="phone" placeholder="Phone" value={personalInfo.phone} onChange={(e) => handleChange(e, null, 'personalInfo', 'phone')} />
  </div>
);

export default PersonalInfo;