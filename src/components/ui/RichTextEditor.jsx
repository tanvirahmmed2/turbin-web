'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading1, Heading2, Quote } from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const toggleBold = (e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); };
  const toggleItalic = (e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); };
  const toggleStrike = (e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); };
  const toggleH1 = (e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); };
  const toggleH2 = (e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); };
  const toggleBulletList = (e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); };
  const toggleOrderedList = (e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); };
  const toggleBlockquote = (e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 rounded-t-xl bg-white">
      <button
        onClick={toggleBold}
        className={`p-2 rounded transition-colors ${editor.isActive('bold') ? ' text-white' : 'text-gray-400'}`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={toggleItalic}
        className={`p-2 rounded transition-colors ${editor.isActive('italic') ? ' text-white' : 'text-gray-400'}`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={toggleStrike}
        className={`p-2 rounded transition-colors ${editor.isActive('strike') ? ' text-white' : 'text-gray-400'}`}
        title="Strike"
      >
        <Strikethrough size={16} />
      </button>

      <div className="w-px h-5 mx-1"></div>

      <button
        onClick={toggleH1}
        className={`p-2 rounded transition-colors ${editor.isActive('heading', { level: 1 }) ? ' text-white' : 'text-gray-400'}`}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={toggleH2}
        className={`p-2 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? ' text-white' : 'text-gray-400'}`}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </button>

      <div className="w-px h-5 mx-1"></div>

      <button
        onClick={toggleBulletList}
        className={`p-2 rounded transition-colors ${editor.isActive('bulletList') ? ' text-white' : 'text-gray-400'}`}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={toggleOrderedList}
        className={`p-2 rounded transition-colors ${editor.isActive('orderedList') ? ' text-white' : 'text-gray-400'}`}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={toggleBlockquote}
        className={`p-2 rounded transition-colors ${editor.isActive('blockquote') ? ' text-white' : 'text-gray-400'}`}
        title="Quote"
      >
        <Quote size={16} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder = 'Write something...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        className: 'prose prose-sm sm:prose-base prose-invert prose-p:my-1 prose-headings:my-2 focus:outline-none min-h-[120px] max-w-none p-4  rounded-b-xl border border-t-0 border-gray-700 text-gray-200',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="rich-text-editor border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <style jsx global>{`
        .is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
