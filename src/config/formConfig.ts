import type { FormConfig } from '../types/form';

export const formConfig: FormConfig = {
  title: 'Cadastro de Participante',
  description:
    'Preencha seus dados para realizar seu cadastro.',

  fields: [
    {
      id: 'name',
      label: 'Nome completo',
      type: 'text',
      required: true,
      placeholder: 'Digite seu nome',
    },
    {
      id: 'email',
      label: 'E-mail',
      type: 'email',
      required: true,
      placeholder: 'exemplo@email.com',
    },
    {
      id: 'password',
      label: 'Senha',
      type: 'password',
      required: true,
      placeholder: 'Crie uma senha',
    },
    {
      id: 'age',
      label: 'Idade',
      type: 'number',
      required: true,
      placeholder: 'Ex.: 20',
    },
    {
      id: 'about',
      label: 'Sobre você',
      type: 'multiline',
      required: false,
      placeholder: 'Conte um pouco sobre você',
    },
    {
      id: 'course',
      label: 'Curso',
      type: 'select',
      required: true,
      options: [
        { label: 'Engenharia de Software', value: 'software' },
        { label: 'Análise e Desenvolvimento de Sistemas', value: 'ads' },
        { label: 'Ciência da Computação', value: 'computacao' },
      ],
    },
    {
      id: 'period',
      label: 'Período de estudo',
      type: 'radio',
      required: true,
      options: [
        { label: 'Manhã', value: 'manha' },
        { label: 'Tarde', value: 'tarde' },
        { label: 'Noite', value: 'noite' },
      ],
    },
    {
      id: 'terms',
      label: 'Aceito os termos de participação',
      type: 'checkbox',
      required: true,
    },
    {
      id: 'notifications',
      label: 'Desejo receber notificações',
      type: 'switch',
      required: false,
    },
    {
      id: 'birthDate',
      label: 'Data de nascimento',
      type: 'date',
      required: true,
      placeholder: 'AAAA-MM-DD',
    },
  ],
};