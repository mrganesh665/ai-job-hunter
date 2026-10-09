import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Sun, 
  Moon, 
  Zap, 
  Sparkles, 
  Check, 
  ChevronDown 
} from 'lucide-react';

const THEMES = [
  {
    id: 'dark-slate',
    label: 'Dark Slate',
    description: 'Deep space indigo glassmorphism',
    icon: Moon,
    color: '#6366f1'
  },
  {
    id: 'luxury-light',
    label: 'Luxury Light',
    description: 'Crisp minimal white (Stripe style)',
    icon: Sun,
    color: '#4f46e5'
  },
  {
    id: 'cyber-obsidian',
    label: 'Cyber Obsidian',
    description: 'Pitch OLED black & electric cyan',
    icon: Zap,
    color: '#00f2fe'
  },
  {
    id: 'emerald-midnight',
    label: 'Emerald Midnight',
    description: 'Deep navy obsidian & rich emerald',
    icon: Sparkles,
    color: '#10b981'
  }
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('dark-slate');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize theme from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem('ai_job_hunter_theme') || 'dark-slate';
    setCurrentTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTheme = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('ai_job_hunter_theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    setIsOpen(false);
  };

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];
  const ActiveIcon = activeThemeObj.icon;

  return (
    <div className="theme-switcher-wrapper" ref={dropdownRef}>
      <button
        className="btn-theme-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Change UI Theme"
      >
        <div 
          className="theme-trigger-indicator"
          style={{ backgroundColor: activeThemeObj.color }}
        />
        <ActiveIcon size={14} style={{ color: activeThemeObj.color }} />
        <span className="theme-trigger-label">{activeThemeObj.label}</span>
        <ChevronDown size={13} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="theme-dropdown-menu">
          <div className="theme-menu-header">
            <Palette size={14} />
            <span>Select Interface Theme</span>
          </div>

          <div className="theme-options-list">
            {THEMES.map((theme) => {
              const Icon = theme.icon;
              const isSelected = currentTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  className={`theme-option-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectTheme(theme.id)}
                >
                  <div 
                    className="theme-option-icon-box"
                    style={{ backgroundColor: `${theme.color}20`, color: theme.color }}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="theme-option-text">
                    <span className="theme-option-title">{theme.label}</span>
                    <span className="theme-option-desc">{theme.description}</span>
                  </div>
                  {isSelected && (
                    <div className="theme-active-check">
                      <Check size={14} style={{ color: theme.color }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
