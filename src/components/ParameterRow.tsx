'use client';

import { useState } from 'react';
import styles from './ParameterRow.module.css';

const ParameterRow = ({ parameter, onUpdate, onRemove, onAddChild }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleInputChange = (field, value) => {
    onUpdate({ ...parameter, [field]: value });
  };

  const handleAddChild = () => {
    const newChild = { id: Date.now(), name: '', type: 'string', required: false, systemVar: false, description: '', children: [] };
    onAddChild(parameter.id, newChild);
  };

  const isNested = parameter.type === 'object' || parameter.type === 'array';

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {isNested && (
          <button onClick={() => setIsExpanded(!isExpanded)} className={styles.toggleButton}>
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        <input
          type="text"
          placeholder="변수명"
          value={parameter.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <select value={parameter.type} onChange={(e) => handleInputChange('type', e.target.value)}>
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="array">Array</option>
          <option value="object">Object</option>
          <option value="enum">Enum</option>
        </select>
        <label><input type="checkbox" checked={parameter.required} onChange={(e) => handleInputChange('required', e.target.checked)} /> 필수</label>
        <label><input type="checkbox" checked={parameter.systemVar} onChange={(e) => handleInputChange('systemVar', e.target.checked)} /> 시스템 변수</label>
        <input
          type="text"
          placeholder="설명"
          value={parameter.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        <button onClick={onRemove}>삭제</button>
      </div>
      {isExpanded && isNested && (
        <div className={styles.children}>
          {parameter.children.map(child => (
            <ParameterRow
              key={child.id}
              parameter={child}
              onUpdate={(updatedChild) => {
                const newChildren = parameter.children.map(c => c.id === updatedChild.id ? updatedChild : c);
                onUpdate({ ...parameter, children: newChildren });
              }}
              onRemove={() => {
                const newChildren = parameter.children.filter(c => c.id !== child.id);
                onUpdate({ ...parameter, children: newChildren });
              }}
              onAddChild={onAddChild}
            />
          ))}
          <button onClick={handleAddChild} className={styles.addChildButton}>자식 요소 추가</button>
          {parameter.type === 'enum' && (
             <div className={styles.enumContainer}>
                {/* Enum 값들을 관리하는 UI가 여기에 추가됩니다. */}
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParameterRow;
