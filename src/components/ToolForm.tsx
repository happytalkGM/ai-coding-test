'use client'

import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'

const authTypes = [
  { value: 'basic_auth', label: 'Basic Auth' },
  { value: 'bearer_token', label: 'Bearer Token' },
  { value: 'oauth', label: 'OAuth' },
  { value: 'jwt', label: 'JWT' },
  { value: 'api_key', label: 'API Key' },
]

const dataTypes = [
  { value: 'string', label: '문자열' },
  { value: 'number', label: '숫자' },
  { value: 'boolean', label: '불리언' },
  { value: 'array', label: '배열' },
  { value: 'object', label: '객체' },
  { value: 'enum', label: '열거형' },
]

const validationSchema = Yup.object().shape({
  name: Yup.string().required('도구 이름은 필수입니다'),
  description: Yup.string().required('도구 설명은 필수입니다'),
  authType: Yup.string().required('인증 방식은 필수입니다'),
  httpMethod: Yup.string().required('HTTP Method는 필수입니다'),
  apiUrl: Yup.string().required('API URL은 필수입니다'),
  urlVariables: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('변수 이름은 필수입니다'),
      description: Yup.string().required('변수 설명은 필수입니다'),
    })
  ),
  requestParameters: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('변수 이름은 필수입니다'),
      type: Yup.string().required('자료형은 필수입니다'),
      description: Yup.string().required('변수 설명은 필수입니다'),
    })
  ),
  responseParameters: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('변수 이름은 필수입니다'),
      type: Yup.string().required('자료형은 필수입니다'),
      description: Yup.string().required('변수 설명은 필수입니다'),
    })
  ),
})

const initialValues = {
  name: '',
  description: '',
  authType: '',
  httpMethod: 'GET',
  apiUrl: '',
  urlVariables: [],
  requestParameters: [],
  responseParameters: [],
}

const ParameterField = ({ name, remove, index }: { name: string; remove: (index: number) => void; index: number }) => (
  <div className="flex gap-4 items-start mb-4 p-4 border rounded">
    <div className="flex-1">
      <Field
        name={`${name}.name`}
        placeholder="변수 이름"
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="flex-1">
      <Field
        as="select"
        name={`${name}.type`}
        className="w-full p-2 border rounded"
      >
        <option value="">자료형 선택</option>
        {dataTypes.map(type => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </Field>
    </div>
    <div className="flex-1">
      <Field
        name={`${name}.description`}
        placeholder="변수 설명"
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="flex items-center gap-2">
      <label className="flex items-center">
        <Field
          type="checkbox"
          name={`${name}.required`}
          className="mr-2"
        />
        필수
      </label>
      <label className="flex items-center">
        <Field
          type="checkbox"
          name={`${name}.useSystemVar`}
          className="mr-2"
        />
        시스템 변수
      </label>
    </div>
    <button
      type="button"
      onClick={() => remove(index)}
      className="text-red-500 hover:text-red-700"
    >
      삭제
    </button>
  </div>
)

export default function ToolForm() {
  const handleSubmit = (values: any) => {
    console.log(values)
    // TODO: API 호출 구현
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form className="space-y-6">
          <div>
            <label className="block mb-2">도구 이름</label>
            <Field
              name="name"
              className="w-full p-2 border rounded"
              placeholder="도구 이름을 입력하세요"
            />
          </div>

          <div>
            <label className="block mb-2">도구 설명</label>
            <Field
              as="textarea"
              name="description"
              className="w-full p-2 border rounded"
              placeholder="도구 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="block mb-2">인증 방식</label>
            <Field
              as="select"
              name="authType"
              className="w-full p-2 border rounded"
            >
              <option value="">인증 방식 선택</option>
              {authTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">HTTP Method</label>
              <Field
                as="select"
                name="httpMethod"
                className="w-full p-2 border rounded"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </Field>
            </div>
            <div>
              <label className="block mb-2">API URL</label>
              <Field
                name="apiUrl"
                className="w-full p-2 border rounded"
                placeholder="API URL을 입력하세요"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">URL 변수</label>
            <FieldArray name="urlVariables">
              {({ push, remove }) => (
                <div>
                  {values.urlVariables.map((_, index) => (
                    <ParameterField
                      key={index}
                      name={`urlVariables.${index}`}
                      remove={remove}
                      index={index}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ name: '', type: '', description: '', required: false, useSystemVar: false })}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    URL 변수 추가
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          <div>
            <label className="block mb-2">요청 파라메터</label>
            <FieldArray name="requestParameters">
              {({ push, remove }) => (
                <div>
                  {values.requestParameters.map((_, index) => (
                    <ParameterField
                      key={index}
                      name={`requestParameters.${index}`}
                      remove={remove}
                      index={index}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ name: '', type: '', description: '', required: false, useSystemVar: false })}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    요청 파라메터 추가
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          <div>
            <label className="block mb-2">응답 파라메터</label>
            <FieldArray name="responseParameters">
              {({ push, remove }) => (
                <div>
                  {values.responseParameters.map((_, index) => (
                    <ParameterField
                      key={index}
                      name={`responseParameters.${index}`}
                      remove={remove}
                      index={index}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ name: '', type: '', description: '', required: false, useSystemVar: false })}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    응답 파라메터 추가
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
            >
              적용
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
} 