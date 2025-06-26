'use client';

import { useState } from 'react';
import styles from './page.module.css';
import ParameterRow from '@/components/ParameterRow';

const ToolSettingsPage = () => {
  const [urlVariables, setUrlVariables] = useState([{ id: 1, required: false, systemVar: false, name: '', description: '' }]);

  const addUrlVariable = () => {
    setUrlVariables([...urlVariables, { id: Date.now(), required: false, systemVar: false, name: '', description: '' }]);
  };

  const removeUrlVariable = (id) => {
    setUrlVariables(urlVariables.filter(v => v.id !== id));
  };

  const [requestParameters, setRequestParameters] = useState([{ id: Date.now(), name: '', type: 'string', required: false, systemVar: false, description: '', children: [] }]);
  const [responseParameters, setResponseParameters] = useState([{ id: Date.now(), name: '', type: 'string', required: false, systemVar: false, description: '', children: [] }]);

  // Helper function to update nested parameters
  const updateParameter = (parameters, setParameters, updatedParam) => {
    const updater = (params) => {
      return params.map(p => {
        if (p.id === updatedParam.id) return updatedParam;
        if (p.children && p.children.length > 0) {
          return { ...p, children: updater(p.children) };
        }
        return p;
      });
    };
    setParameters(updater(parameters));
  };

  // Helper function to remove nested parameters
  const removeParameter = (parameters, setParameters, paramId) => {
      const remover = (params) => {
          return params.filter(p => p.id !== paramId).map(p => {
              if (p.children && p.children.length > 0) {
                  return { ...p, children: remover(p.children) };
              }
              return p;
          });
      };
      setParameters(remover(parameters));
  };

  // Helper function to add child parameters
  const addParameterChild = (parameters, setParameters, parentId, newChild) => {
      const adder = (params) => {
          return params.map(p => {
              if (p.id === parentId) {
                  return { ...p, children: [...p.children, newChild] };
              }
              if (p.children && p.children.length > 0) {
                  return { ...p, children: adder(p.children) };
              }
              return p;
          });
      };
      setParameters(adder(parameters));
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>도구 설정</h1>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="tool-name">이름</label>
          <input id="tool-name" type="text" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tool-description">설명</label>
          <textarea id="tool-description"></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="auth-type">인증 방식</label>
          <select id="auth-type">
            <option value="basic">Basic Auth</option>
            <option value="bearer">Bearer Token</option>
            <option value="oauth">OAuth</option>
            <option value="jwt">JWT</option>
            <option value="apikey">API Key</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>API URL</label>
          <div className={styles.apiUrl}>
            <select>
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <input type="text" placeholder="https://api.example.com/v1/users" />
          </div>
        </div>
      <div className={styles.formGroup}>
          <label>URL 변수</label>
          {urlVariables.map((variable, index) => (
            <div key={variable.id} className={styles.dynamicRow}>
              <input type="text" placeholder="변수 이름" />
              <input type="text" placeholder="변수 설명" />
              <label><input type="checkbox" /> 필수</label>
              <label><input type="checkbox" /> 시스템 변수 사용</label>
              <button type="button" onClick={() => removeUrlVariable(variable.id)}>삭제</button>
            </div>
          ))}
          <button type="button" onClick={addUrlVariable}>변수 추가</button>
        </div>

        <div className={styles.formSection}>
          <label>요청 파라미터</label>
          {requestParameters.map(param => (
            <ParameterRow
              key={param.id}
              parameter={param}
              onUpdate={(p) => updateParameter(requestParameters, setRequestParameters, p)}
              onRemove={() => removeParameter(requestParameters, setRequestParameters, param.id)}
              onAddChild={(parentId, newChild) => addParameterChild(requestParameters, setRequestParameters, parentId, newChild)}
            />
          ))}
           <button type="button" onClick={() => setRequestParameters([...requestParameters, { id: Date.now(), name: '', type: 'string', required: false, systemVar: false, description: '', children: [] }])}>파라미터 추가</button>
        </div>

        <div className={styles.formSection}>
          <label>응답 파라미터</label>
          {responseParameters.map(param => (
            <ParameterRow
              key={param.id}
              parameter={param}
              onUpdate={(p) => updateParameter(responseParameters, setResponseParameters, p)}
              onRemove={() => removeParameter(responseParameters, setResponseParameters, param.id)}
              onAddChild={(parentId, newChild) => addParameterChild(responseParameters, setResponseParameters, parentId, newChild)}
            />
          ))}
          <button type="button" onClick={() => setResponseParameters([...responseParameters, { id: Date.now(), name: '', type: 'string', required: false, systemVar: false, description: '', children: [] }])}>파라미터 추가</button>
        </div>
      </form>
      <button className={styles.applyButton}>적용</button>
    </div>
  );
};

export default ToolSettingsPage;