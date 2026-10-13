"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  required?: boolean;
};

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rte-toolbar-btn${active ? " is-active" : ""}${disabled ? " is-disabled" : ""}`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function ToolbarSeparator() {
  return <span className="rte-toolbar-sep" aria-hidden="true" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "متن را اینجا بنویسید...",
  minHeight = 320,
  required,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["right", "center", "left", "justify"],
        defaultAlignment: "right",
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "rte-is-empty",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        dir: "rtl",
        class: "rte-content",
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const isHeading = (level: 2 | 3 | 4) => editor.isActive("heading", { level });
  const alignment = (align: string) => editor.isActive({ textAlign: align });

  return (
    <div className="rte-wrapper" data-required={required ? "true" : undefined}>
      <div className="rte-toolbar" role="toolbar" aria-label="نوار ابزار ویرایشگر">
        {/* Headings */}
        <ToolbarButton title="عنوان بزرگ (H2)" active={isHeading(2)} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
        <ToolbarButton title="عنوان متوسط (H3)" active={isHeading(3)} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
        <ToolbarButton title="عنوان کوچک (H4)" active={isHeading(4)} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>H4</ToolbarButton>
        <ToolbarSeparator />

        {/* Bold / Italic */}
        <ToolbarButton title="درشت (Bold) — Ctrl+B" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
        </ToolbarButton>
        <ToolbarButton title="کج (Italic) — Ctrl+I" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
        </ToolbarButton>
        <ToolbarSeparator />

        {/* Lists */}
        <ToolbarButton title="فهرست نقطه‌ای" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
        </ToolbarButton>
        <ToolbarButton title="فهرست شماره‌دار" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
        </ToolbarButton>
        <ToolbarSeparator />

        {/* Alignment */}
        <ToolbarButton title="تراز راست (پیش‌فرض RTL)" active={alignment("right")} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>
        </ToolbarButton>
        <ToolbarButton title="تراز وسط" active={alignment("center")} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/></svg>
        </ToolbarButton>
        <ToolbarButton title="تراز چپ" active={alignment("left")} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>
        </ToolbarButton>
        <ToolbarButton title="تراز از دو طرف (Justify)" active={alignment("justify")} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/></svg>
        </ToolbarButton>
        <ToolbarSeparator />

        {/* Blockquote */}
        <ToolbarButton title="نقل‌قول" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
        </ToolbarButton>
        <ToolbarSeparator />

        {/* Undo / Redo */}
        <ToolbarButton title="واگرد (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
        </ToolbarButton>
        <ToolbarButton title="انجام دوباره (Ctrl+Y)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="rte-editor-area" />

      {required && (
        <input
          type="text"
          required
          tabIndex={-1}
          value={editor.getText().trim() ? "x" : ""}
          onChange={() => {}}
          aria-hidden="true"
          className="rte-hidden-input"
        />
      )}
    </div>
  );
}
