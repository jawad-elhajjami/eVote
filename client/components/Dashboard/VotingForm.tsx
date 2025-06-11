import React, { useState } from 'react';
import { Vote, Lock, FileKey } from 'lucide-react';
import forge from 'node-forge';

interface VotingFormProps {
  pollId: string;
  title: string;
  options: string[];
  userId: string;
  onSubmit: (data: { option: string; signature: string; hash: string; voteData: string; timestamp: string }) => Promise<void>;
}

const VotingForm: React.FC<VotingFormProps> = ({ pollId, title, options, userId, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [privateKeyFile, setPrivateKeyFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ option?: string; privateKey?: string }>({});

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    if (errors.option) {
      setErrors(prev => ({ ...prev, option: undefined }));
    }
  };

  const handlePrivateKeyUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (basic check)
      if (!file.name.endsWith('.pem') && !file.name.endsWith('.key')) {
        setErrors(prev => ({ 
          ...prev, 
          privateKey: 'Please upload a valid private key file (.pem or .key)' 
        }));
        return;
      }
      
      setPrivateKeyFile(file);
      if (errors.privateKey) {
        setErrors(prev => ({ ...prev, privateKey: undefined }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { option?: string; privateKey?: string } = {};
    
    if (!selectedOption) {
      newErrors.option = 'Please select an option to vote for';
    }
    
    if (!privateKeyFile) {
      newErrors.privateKey = 'Please upload your private key file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signVoteData = async (voteData: string, privateKeyContent: string): Promise<string> => {
    try {
      // Parse the PEM private key
      const privateKey = forge.pki.privateKeyFromPem(privateKeyContent);
      
      // Create a message digest (SHA-256)
      const md = forge.md.sha256.create();
      md.update(voteData, 'utf8');
      
      // Sign the hash
      const signature = privateKey.sign(md);
      
      // Convert to base64
      return forge.util.encode64(signature);
    } catch (error) {
      console.error('Error signing vote data:', error);
      throw new Error('Failed to sign vote data. Please check your private key file.');
    }
  };

  const hashVoteData = async (voteData: string): Promise<string> => {
    // Create SHA-256 hash of vote data
    const encoder = new TextEncoder();
    const data = encoder.encode(voteData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async () => {
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Read private key file
      const privateKeyContent = await privateKeyFile!.text();
      
      // Create vote data to be signed (must match backend exactly)
      const timestamp = new Date().toISOString();
      const voteData = JSON.stringify({
        pollId,
        option: selectedOption,
        timestamp,
        userId
      });

      console.log("Vote data to be signed:", voteData);
      console.log("Private key file size:", privateKeyContent.length);

      // Sign the vote data
      const signature = await signVoteData(voteData, privateKeyContent);
      console.log("Generated signature:", signature ? "present" : "missing");
      
      // Create hash of vote data
      const hash = await hashVoteData(voteData);
      console.log("Generated hash:", hash);

      // Prepare data for submission
      const submissionData = {
        option: selectedOption,
        signature,
        hash,
        voteData,
        timestamp
      };

      console.log("Submitting data:", submissionData);

      // Submit the signed vote
      await onSubmit(submissionData);

      // Reset form
      setSelectedOption('');
      setPrivateKeyFile(null);
      
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error submitting vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cast Your Vote</h2>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      </div>

      <div className="space-y-6">
        {/* Vote Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select your choice:
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  id={`option-${index}`}
                  name="vote-option"
                  type="radio"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionChange(option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor={`option-${index}`}
                  className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          {errors.option && (
            <p className="mt-2 text-sm text-red-600">{errors.option}</p>
          )}
        </div>

        {/* Private Key Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload your private key:
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <FileKey className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="private-key-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload your private key</span>
                  <input
                    id="private-key-upload"
                    name="private-key-upload"
                    type="file"
                    accept=".pem,.key"
                    onChange={handlePrivateKeyUpload}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PEM or KEY files only</p>
              {privateKeyFile && (
                <p className="text-sm text-green-600 flex items-center justify-center">
                  <Lock className="h-4 w-4 mr-1" />
                  {privateKeyFile.name}
                </p>
              )}
            </div>
          </div>
          {errors.privateKey && (
            <p className="mt-2 text-sm text-red-600">{errors.privateKey}</p>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <Lock className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Your vote is secure
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Your private key never leaves your device. The vote is signed locally 
                  and only the signature is sent to the server for verification.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedOption || !privateKeyFile}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Vote...
            </>
          ) : (
            <>
              <Vote className="h-5 w-5 mr-2" />
              Submit Vote
            </>
          )}
        </button>
              </div>
    </div>
  );
};

export default VotingForm;