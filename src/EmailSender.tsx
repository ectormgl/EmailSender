
import { useState } from 'react';
import { PlusCircle, Trash2, Send, ArrowRight } from 'lucide-react';
import emailjs from 'emailjs-com';

// Componente Checkbox com callback para notificar alterações
const Checkbox = ({ label, onChange }: { label: string; onChange: (isChecked: boolean) => void }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    setIsChecked((prev) => !prev);
    onChange(!isChecked);
  };

  return (
    <div className="checkbox-wrapper">
      <label>
        <input type="checkbox" checked={isChecked} onChange={handleChange} />
        <span>{label}</span>
      </label>
    </div>
  );
};

const EmailForm = () => {
  interface StatusInterface {
    loading: boolean;
    error: string | null;
    success: boolean;
  }

  interface Email {
    from_name: string;
    to_email: string;
    receiver: string;
    subtitle: string;
    body_content: string;
  }

  const [step, setStep] = useState(1);
  const [emailList, setEmailList] = useState<Email[]>([
    { from_name: '', to_email: '', receiver: '', subtitle: '', body_content: '' }
  ]);
  const [status, setStatus] = useState<StatusInterface>({ loading: false, error: null, success: false });
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);

  };

  const handleAddEmail = () => {
    setEmailList([...emailList, { from_name: '', to_email: '', receiver: '', subtitle: '', body_content: '' }]);
    
  };

  const handleRemoveEmail = (index: number) => {
    const newList = emailList.filter((_, i) => i !== index);
    setEmailList(newList);
  };

  const handleChange = (index: number, field: keyof Email, value: string) => {
    const newList = [...emailList];
    newList[index][field] = value;
    setEmailList(newList);
  };

  const handleSubmit = async () => {
    setStatus({ loading: true, error: null, success: false });
    const userID = import.meta.env.VITE_USER_ID;
    const serviceID = import.meta.env.VITE_SERVICE_ID;
    const templateID = import.meta.env.VITE_TEMPLATE_ID;


    try {
      // Loop para enviar um e-mail para cada item em emailList
      for (const email of emailList) {
        await emailjs.send(
            serviceID,
            templateID,
            {
              from_name: email.from_name,
              to_email: email.to_email,
              receiver: email.receiver,
              subtitle: isChecked ? `Candidatura para Estágio em Desenvolvimento de Software` : email.subtitle,
              body_content: email.body_content,
            },
            userID
          );
      }

      setStatus({ loading: false, error: null, success: true });
    } catch (error) {
      setStatus({
        loading: false,
        error: error instanceof Error ? `ERRO AQUI: ${error.message} ${error.name}` : 'Unknown error',
        success: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Email Sender</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            {step === 1 ? 'Email Configuration' : 'Message Content'}
          </h2>


          {emailList.map((email, index) => (
            <div key={index} className="mb-8 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Email #{index + 1}</h3>
                {emailList.length > 1 && (
                  <button onClick={() => handleRemoveEmail(index)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {step === 1 ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome Empresa</label>
                      <input
                        type="email"
                        value={email.from_name}
                        onChange={(e) => handleChange(index, 'from_name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To Email</label>
                      <input
                        type="email"
                        value={email.to_email}
                        onChange={(e) => handleChange(index, 'to_email', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">TÍTULO</label>
                      <input
                        type="text"
                        value={email.subtitle}
                        onChange={(e) => handleChange(index, 'subtitle', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required disabled={isChecked}
                      />
                      
                    </div>
                   
                      <Checkbox label="Usar opção padrão" onChange={handleCheckboxChange}  />
                    
                  </div>
                </>
              )}
            </div>
          ))}
<div className="flex justify-between items-center mt-6">
            <button
              onClick={handleAddEmail}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Another Email
            </button>

            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={status.loading}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {status.loading ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Emails
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {status.error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {status.error}
            </div>
          )}

          {status.success && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
              Emails sent successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailForm;