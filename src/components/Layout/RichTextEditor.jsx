import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link, 
  Image as ImageIcon,
  Code,
  Quote,
  Heading2
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const handleFormat = (command, value = '') => {
    document.execCommand(command, false, value);
    // Update React state with HTML content
    const editor = document.querySelector('.rich-text-editor');
    onChange(editor.innerHTML);
  };

  const handleInsertLink = () => {
    if (linkUrl && linkText) {
      const html = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      handleFormat('insertHTML', html);
      setIsLinkModalOpen(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('formatBlock', '<h2>')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Heading"
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('formatBlock', '<blockquote>')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Quote"
        >
          <Quote size={18} />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertHTML', '<code></code>')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Code"
        >
          <Code size={18} />
        </button>
        <button
          type="button"
          onClick={() => setIsLinkModalOpen(true)}
          className="p-2 hover:bg-gray-200 rounded"
          title="Insert Link"
        >
          <Link size={18} />
        </button>
      </div>

      {/* Editor */}
      <div
        className="rich-text-editor min-h-[200px] p-4 focus:outline-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.target.innerHTML)}
        placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text to display
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Link text"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertLink}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;