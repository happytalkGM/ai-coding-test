'use client';

import { useState } from 'react';

interface URLVariable {
  id: string;
  name: string;
  description: string;
  required: boolean;
  useSystemVariable: boolean;
}

interface Parameter {
  id: string;
  name: string;
  type: string;
  required: boolean;
  useSystemVariable: boolean;
  description: string;
  children?: Parameter[];
}

export default function ToolSettings() {
  const [toolName, setToolName] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  const [authMethod, setAuthMethod] = useState('basic auth');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [apiUrl, setApiUrl] = useState('');
  const [urlVariables, setUrlVariables] = useState<URLVariable[]>([]);
  const [requestParams, setRequestParams] = useState<Parameter[]>([]);
  const [responseParams, setResponseParams] = useState<Parameter[]>([]);

  const authOptions = ['basic auth', 'bearer token', 'OAuth', 'JWT', 'API Key'];
  const typeOptions = ['string', 'number', 'boolean', 'array', 'object', 'enum'];

  const addUrlVariable = () => {
    setUrlVariables([...urlVariables, {
      id: Date.now().toString(),
      name: '',
      description: '',
      required: false,
      useSystemVariable: false
    }]);
  };

  const removeUrlVariable = (id: string) => {
    setUrlVariables(urlVariables.filter(v => v.id !== id));
  };

  const updateUrlVariable = (id: string, field: keyof URLVariable, value: string | boolean) => {
    setUrlVariables(urlVariables.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const addParameter = (params: Parameter[], setParams: (params: Parameter[]) => void, parentId?: string) => {
    const newParam: Parameter = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      required: false,
      useSystemVariable: false,
      description: '',
      children: []
    };

    if (parentId) {
      const updateParamChildren = (params: Parameter[]): Parameter[] => {
        return params.map(p => {
          if (p.id === parentId) {
            return { ...p, children: [...(p.children || []), newParam] };
          } else if (p.children) {
            return { ...p, children: updateParamChildren(p.children) };
          }
          return p;
        });
      };
      setParams(updateParamChildren(params));
    } else {
      setParams([...params, newParam]);
    }
  };

  const removeParameter = (params: Parameter[], setParams: (params: Parameter[]) => void, id: string) => {
    const removeParam = (params: Parameter[]): Parameter[] => {
      return params.filter(p => p.id !== id).map(p => ({
        ...p,
        children: p.children ? removeParam(p.children) : []
      }));
    };
    setParams(removeParam(params));
  };

  const updateParameter = (params: Parameter[], setParams: (params: Parameter[]) => void, id: string, field: keyof Parameter, value: string | boolean | Parameter[]) => {
    const updateParam = (params: Parameter[]): Parameter[] => {
      return params.map(p => {
        if (p.id === id) {
          return { ...p, [field]: value };
        } else if (p.children) {
          return { ...p, children: updateParam(p.children) };
        }
        return p;
      });
    };
    setParams(updateParam(params));
  };

  const renderParameters = (params: Parameter[], setParams: (params: Parameter[]) => void, depth = 0) => {
    return params.map(param => (
      <div key={param.id} style={{ marginLeft: `${depth * 20}px`, marginBottom: '15px', border: '1px solid #ddd', padding: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="변수명"
            value={param.name}
            onChange={e => updateParameter(params, setParams, param.id, 'name', e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            value={param.type}
            onChange={e => updateParameter(params, setParams, param.id, 'type', e.target.value)}
            style={{ width: '120px' }}
          >
            {typeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={param.required}
              onChange={e => updateParameter(params, setParams, param.id, 'required', e.target.checked)}
            />
            필수
          </label>
          <label>
            <input
              type="checkbox"
              checked={param.useSystemVariable}
              onChange={e => updateParameter(params, setParams, param.id, 'useSystemVariable', e.target.checked)}
            />
            시스템 변수 사용
          </label>
          <button onClick={() => removeParameter(params, setParams, param.id)}>삭제</button>
        </div>
        <input
          type="text"
          placeholder="변수 설명"
          value={param.description}
          onChange={e => updateParameter(params, setParams, param.id, 'description', e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        {(param.type === 'array' || param.type === 'object') && (
          <div>
            <button onClick={() => addParameter(params, setParams, param.id)}>하위 파라메터 추가</button>
            {param.children && param.children.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                {renderParameters(param.children, (newChildren) => {
                  updateParameter(params, setParams, param.id, 'children', newChildren);
                }, depth + 1)}
              </div>
            )}
          </div>
        )}
      </div>
    ));
  };

  const handleApply = () => {
    const toolSchema = {
      name: toolName,
      description: toolDescription,
      authMethod,
      api: {
        method: httpMethod,
        url: apiUrl
      },
      urlVariables,
      requestParams,
      responseParams
    };
    console.log('Tool Schema:', toolSchema);
    alert('도구 설정이 저장되었습니다.');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>도구 설정</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>기본 정보</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label>이름:</label>
            <input
              type="text"
              value={toolName}
              onChange={e => setToolName(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div>
            <label>설명:</label>
            <textarea
              value={toolDescription}
              onChange={e => setToolDescription(e.target.value)}
              style={{ width: '100%', padding: '8px', minHeight: '80px' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>인증 방식</h2>
        <select
          value={authMethod}
          onChange={e => setAuthMethod(e.target.value)}
          style={{ width: '200px', padding: '8px' }}
        >
          {authOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>API URL</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select
            value={httpMethod}
            onChange={e => setHttpMethod(e.target.value)}
            style={{ width: '120px', padding: '8px' }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          <input
            type="text"
            placeholder="http://example.com/api/{variable}"
            value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
            style={{ flex: 1, padding: '8px' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>URL 변수</h2>
        <button onClick={addUrlVariable} style={{ marginBottom: '1rem' }}>변수 추가</button>
        {urlVariables.map(variable => (
          <div key={variable.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="변수 이름"
              value={variable.name}
              onChange={e => updateUrlVariable(variable.id, 'name', e.target.value)}
              style={{ width: '150px', padding: '6px' }}
            />
            <input
              type="text"
              placeholder="변수 설명"
              value={variable.description}
              onChange={e => updateUrlVariable(variable.id, 'description', e.target.value)}
              style={{ flex: 1, padding: '6px' }}
            />
            <label>
              <input
                type="checkbox"
                checked={variable.required}
                onChange={e => updateUrlVariable(variable.id, 'required', e.target.checked)}
              />
              필수
            </label>
            <label>
              <input
                type="checkbox"
                checked={variable.useSystemVariable}
                onChange={e => updateUrlVariable(variable.id, 'useSystemVariable', e.target.checked)}
              />
              시스템 변수 사용
            </label>
            <button onClick={() => removeUrlVariable(variable.id)}>삭제</button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>요청 파라메터</h2>
        <button onClick={() => addParameter(requestParams, setRequestParams)} style={{ marginBottom: '1rem' }}>
          파라메터 추가
        </button>
        {renderParameters(requestParams, setRequestParams)}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>응답 파라메터</h2>
        <button onClick={() => addParameter(responseParams, setResponseParams)} style={{ marginBottom: '1rem' }}>
          파라메터 추가
        </button>
        {renderParameters(responseParams, setResponseParams)}
      </div>

      <div style={{ textAlign: 'right', marginTop: '3rem' }}>
        <button
          onClick={handleApply}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          적용
        </button>
      </div>
    </div>
  );
}