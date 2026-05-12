import React, { useState } from 'react';
import { FaChevronDown, FaCarSide, FaClipboard, FaShieldAlt, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import './RoleDropdown.css';
 
/**
 * RoleDropdown Component
 * Displays all available user roles from backend enum
 *
 * Props:
 * - value: Currently selected role
 * - onChange: Callback function when role is selected
 * - disabled: Whether dropdown is disabled
 * - placeholder: Placeholder text
 */
const RoleDropdown = ({ value, onChange, disabled = false, placeholder = 'Select Role' }) => {
  const [isOpen, setIsOpen] = useState(false);
 
  // Map of roles with their display names and icons
  const roles = [
    {
      value: 'TRANSPORT_OFFICER',
      label: 'Transport Officer',
      icon: <FaCarSide />,
      description: 'Transport department officer'
    },
    {
      value: 'PROGRAM_MANAGER',
      label: 'Program Manager',
      icon: <FaClipboard />,
      description: 'Manages transport programs'
    },
    {
      value: 'ADMINISTRATOR',
      label: 'Administrator',
      icon: <FaShieldAlt />,
      description: 'System administrator'
    },
    {
      value: 'COMPLIANCE_OFFICER',
      label: 'Compliance Officer',
      icon: <FaFileAlt />,
      description: 'Ensures compliance standards'
    },
    {
      value: 'GOVERNMENT_AUDITOR',
      label: 'Government Auditor',
      icon: <FaCheckCircle />,
      description: 'Audits government operations'
    }
  ];
 
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
 
  const handleSelectRole = (roleValue) => {
    onChange(roleValue);
    setIsOpen(false);
  };
 
  // Get selected role label
  const selectedRole = roles.find(role => role.value === value);
  const selectedLabel = selectedRole ? selectedRole.label : placeholder;
 
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.role-dropdown-wrapper');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsOpen(false);
      }
    };
 
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);
 
  return (
    <div className={`role-dropdown-wrapper ${disabled ? 'disabled' : ''}`}>
      <button
        className={`role-dropdown-button ${isOpen ? 'open' : ''} ${value ? 'selected' : ''}`}
        onClick={toggleDropdown}
        disabled={disabled}
        type="button"
      >
        <span className="role-dropdown-label">
          {selectedRole && (
            <>
              <span className="role-icon">{selectedRole.icon}</span>
              <span>{selectedLabel}</span>
            </>
          )}
          {!selectedRole && <span>{placeholder}</span>}
        </span>
        <FaChevronDown className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </button>
 
      {isOpen && (
        <div className="role-dropdown-content">
          {roles.map((role) => (
            <button
              key={role.value}
              className={`role-option ${value === role.value ? 'selected' : ''}`}
              onClick={() => handleSelectRole(role.value)}
              type="button"
            >
              <span className="role-option-icon">{role.icon}</span>
              <div className="role-option-content">
                <span className="role-option-label">{role.label}</span>
                <span className="role-option-description">{role.description}</span>
              </div>
              {value === role.value && (
                <span className="role-option-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default RoleDropdown;