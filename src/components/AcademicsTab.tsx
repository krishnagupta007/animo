import React, { memo } from 'react';
import { AccordionItem } from './AccordionItem';
import { FlashcardViewer } from './FlashcardViewer';
import type { Flashcard } from './FlashcardViewer';
import { playClickSound } from '../utils/AudioEngine';

interface SubjectResource {
  id: string;
  name: string;
  books: string[];
  chapters: string[];
}

interface AcademicsTabProps {
  targetExam: string;
  handleSetTargetExam: (examName: string) => void;
  setMascotMsg: (msg: string) => void;
  newSubjectName: string;
  setNewSubjectName: (val: string) => void;
  handleAddSubject: (subjectName: string) => void;
  handleDeleteSubject: (subjectId: string) => void;
  academicResources: { subjects: SubjectResource[] };
  handleAddBook: (subjectId: string, bookName: string) => void;
  handleAddChapter: (subjectId: string, chapterName: string) => void;
  selectedPracticeSubjectId: string;
  setSelectedPracticeSubjectId: (id: string) => void;
  flashcards: Flashcard[];
  handleMasterFlashcard: (id: string, e: React.MouseEvent) => void;
  handleReviewLaterFlashcard: (id: string) => void;
  genSubjectId: string;
  setGenSubjectId: (id: string) => void;
  genBookName: string;
  setGenBookName: (name: string) => void;
  genChapterName: string;
  setGenChapterName: (name: string) => void;
  handleGenerateFlashcards: (subjectId: string, bookName: string, chapterName: string) => void;

  // PDF Extractor props
  pdfUploadedName: string | null;
  setPdfUploadedName: (n: string | null) => void;
  pdfUploadedSize: string | null;
  setPdfUploadedSize: (s: string | null) => void;
  pdfLoading: boolean;
  pdfLoadingStep: string;
  handleGeneratePdfFlashcards: () => void;
}

export const AcademicsTab: React.FC<AcademicsTabProps> = memo(({
  targetExam,
  handleSetTargetExam,
  setMascotMsg,
  newSubjectName,
  setNewSubjectName,
  handleAddSubject,
  handleDeleteSubject,
  academicResources,
  handleAddBook,
  handleAddChapter,
  selectedPracticeSubjectId,
  setSelectedPracticeSubjectId,
  flashcards,
  handleMasterFlashcard,
  handleReviewLaterFlashcard,
  genSubjectId,
  setGenSubjectId,
  genBookName,
  setGenBookName,
  genChapterName,
  setGenChapterName,
  handleGenerateFlashcards,
  pdfUploadedName,
  setPdfUploadedName,
  pdfUploadedSize,
  setPdfUploadedSize,
  pdfLoading,
  pdfLoadingStep,
  handleGeneratePdfFlashcards,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfUploadedName(file.name);
      setPdfUploadedSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
      setMascotMsg(`Loaded PDF "${file.name}". Ready to extract MCQs! 🦉📄`);
    }
  };

  const filteredFlashcards =
    selectedPracticeSubjectId === 'all'
      ? flashcards
      : flashcards.filter((fc) => fc.subjectId === selectedPracticeSubjectId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Target Exam selector & Guidelines */}
      <div className="duo-card" data-testid="target-exam-card">
        <h3>Target Exam Guidelines</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          Select your target and unlock standard interactive syllabus guidelines.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
              Target exam
            </label>
            <select
              className="academics-select"
              value={['UPSC', 'IAS', 'NEET', 'JEE'].includes(targetExam) ? targetExam : 'Custom'}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== 'Custom') {
                  handleSetTargetExam(val);
                } else {
                  handleSetTargetExam('Custom Exam');
                }
              }}
              data-testid="target-exam-select"
            >
              <option value="UPSC">UPSC Civil Services</option>
              <option value="IAS">IAS (Indian Administrative Service)</option>
              <option value="NEET">NEET UG Medical Entrance</option>
              <option value="JEE">JEE Mains & Advanced Engineering</option>
              <option value="Custom">Custom Target...</option>
            </select>
          </div>

          {!['UPSC', 'IAS', 'NEET', 'JEE'].includes(targetExam) && (
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
                Custom exam name
              </label>
              <input
                type="text"
                value={targetExam}
                onChange={(e) => handleSetTargetExam(e.target.value)}
                placeholder="e.g. GRE, GMAT, CA"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--rounded-md)',
                  border: '2px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontFamily: 'var(--font-duo)',
                  fontWeight: 700,
                }}
              />
            </div>
          )}
        </div>

        {/* Interactive guidelines accordion using AccordionItem */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AccordionItem
            title="📅 Prep Timeline & Schedule"
            content={
              targetExam.includes('NEET')
                ? 'Recommended: 6-8 hours daily. Target standard NCERT curriculum cycles. Complete 1 mock exam per week in the final 3 months.'
                : targetExam.includes('JEE')
                ? 'Recommended: 7-9 hours daily. Focus heavily on core conceptual derivations in Physics & Mathematics. Solve JEE Advanced PYQs daily.'
                : targetExam.includes('UPSC') || targetExam.includes('IAS')
                ? 'Recommended: 8-10 hours daily. Stage 1: Prelims GS + CSAT (Factual revision). Stage 2: Mains (9 papers descriptive). Stage 3: Interview.'
                : 'Recommended: 4-6 hours daily. Set clear milestones, break down the syllabus into weekly goals, and practice retrieval with flashcards.'
            }
            onOpen={() => setMascotMsg('Timeline details loaded! Set study hours accordingly. 📅🦉')}
          />
          <AccordionItem
            title="📖 Syllabus & Key Books"
            content={
              targetExam.includes('NEET')
                ? 'Subjects: Physics, Chemistry, Biology (Botany/Zoology). Core resources: NCERT Biology Volumes, HC Verma, OP Tandon Chemistry.'
                : targetExam.includes('JEE')
                ? 'Subjects: Physics, Chemistry, Mathematics. Core resources: HC Verma, Irodov, Cengage Math series, RC Mukherjee Chemistry.'
                : targetExam.includes('UPSC') || targetExam.includes('IAS')
                ? 'Subjects: Polity, History, Geography, Economics, Ethics, CSAT. Core resources: Laxmikanth, Bipin Chandra, Ramesh Singh.'
                : 'Add your subjects, reference books, and chapter lists in the resource organizer below.'
            }
            onOpen={() => setMascotMsg('Syllabus guidelines checked. Add these books to your organizer! 📚')}
          />
          <AccordionItem
            title="💡 Dynamic Stress & Study Tips"
            content="Never study for more than 90 minutes straight. High stress levels block working memory retrieval. If fatigue score reaches 70%, take a guided CBT breathing break."
            onOpen={() => setMascotMsg('Calm mind = better memory! Focus on spacing and breathing. 🍃🦉')}
          />
        </div>
      </div>

      {/* Academic Resource Organizer */}
      <div className="duo-card" data-testid="academic-resources-organizer">
        <h3>Academic Resource Organizer</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          Organize your subjects, reference books, and chapters to construct study guides.
        </p>

        {/* Add Subject form */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Enter Subject (e.g., Chemistry, Polity)"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 'var(--rounded-md)',
              border: '2px solid var(--border-color)',
              outline: 'none',
              fontFamily: 'var(--font-duo)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            onClick={() => {
              handleAddSubject(newSubjectName);
              setNewSubjectName('');
            }}
            className="duo-btn-teal"
            style={{ padding: '10px 16px' }}
          >
            ＋ Add Subject
          </button>
        </div>

        {/* List Subjects */}
        {(academicResources?.subjects || []).length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '13px', padding: '20px 0' }}>
            No subjects added yet. Add a subject above to get started!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(academicResources?.subjects || []).map((subj) => (
              <div
                key={subj.id}
                style={{
                  border: '2px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '16px',
                  backgroundColor: 'rgba(142,142,147,0.02)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <strong style={{ fontSize: '16px', color: 'var(--duo-purple)' }}>
                    📚 {subj.name}
                  </strong>
                  <button
                    onClick={() => handleDeleteSubject(subj.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: 'var(--duo-red)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    🗑️ Delete Subject
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {/* Books column */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: 'var(--text-secondary)',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Reference Books
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                      {subj.books.map((book, bIdx) => (
                        <div
                          key={bIdx}
                          style={{
                            fontSize: '12.5px',
                            padding: '4px 6px',
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          📖 {book}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Add Book"
                        id={`book-input-${subj.id}`}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          fontSize: '11px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          outline: 'none',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const inputEl = e.currentTarget;
                            handleAddBook(subj.id, inputEl.value);
                            inputEl.value = '';
                          }
                        }}
                      />
                      <button
                        className="duo-btn-teal"
                        style={{ padding: '6px 10px', fontSize: '11px' }}
                        onClick={() => {
                          const el = document.getElementById(`book-input-${subj.id}`) as HTMLInputElement;
                          if (el && el.value.trim()) {
                            handleAddBook(subj.id, el.value);
                            el.value = '';
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Chapters column */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: 'var(--text-secondary)',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Chapters / Topics
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                      {subj.chapters.map((chap, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            fontSize: '12.5px',
                            padding: '4px 6px',
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          📂 {chap}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Add Chapter"
                        id={`chap-input-${subj.id}`}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          fontSize: '11px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          outline: 'none',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const inputEl = e.currentTarget;
                            handleAddChapter(subj.id, inputEl.value);
                            inputEl.value = '';
                          }
                        }}
                      />
                      <button
                        className="duo-btn-teal"
                        style={{ padding: '6px 10px', fontSize: '11px' }}
                        onClick={() => {
                          const el = document.getElementById(`chap-input-${subj.id}`) as HTMLInputElement;
                          if (el && el.value.trim()) {
                            handleAddChapter(subj.id, el.value);
                            el.value = '';
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF MCQ Extractor Card */}
      <div className="duo-card" data-testid="pdf-extractor-card">
        <h3>📄 AI Chapter MCQ Extractor from PDF</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          Upload your textbook chapter or syllabus PDF to generate gamified 4-option MCQs.
        </p>

        <div
          style={{
            border: '2px dashed var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            backgroundColor: 'rgba(142,142,147,0.02)',
            position: 'relative',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file && file.name.endsWith('.pdf')) {
              setPdfUploadedName(file.name);
              setPdfUploadedSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
              setMascotMsg(`Dropped PDF "${file.name}". Click extract to proceed! 🦉`);
            }
          }}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📁</span>
          {pdfUploadedName ? (
            <div>
              <strong style={{ display: 'block', fontSize: '14px', color: 'var(--duo-purple)' }}>
                {pdfUploadedName}
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Size: {pdfUploadedSize} • Click or drag to replace
              </span>
            </div>
          ) : (
            <div>
              <strong style={{ display: 'block', fontSize: '14px' }}>
                Drag & drop syllabus chapter PDF here
              </strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                or click to browse local files
              </span>
            </div>
          )}
        </div>

        {pdfUploadedName && !pdfLoading && (
          <button
            onClick={() => {
              playClickSound();
              handleGeneratePdfFlashcards();
            }}
            className="duo-btn-teal"
            style={{ width: '100%', marginTop: '16px' }}
          >
            Extract Chapter MCQs from PDF
          </button>
        )}

        {pdfLoading && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--duo-orange)' }}>
              ⚡ {pdfLoadingStep}
            </span>
            <div className="duo-progress-bar" style={{ height: '8px', marginTop: '8px' }}>
              <div
                className="duo-progress-fill"
                style={{
                  width: '75%',
                  backgroundColor: 'var(--duo-orange)',
                  animation: 'soundwave-bounce 1s infinite alternate',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* New Section: Subject Library & Practice Center */}
      <div className="duo-card" data-testid="library-practice-section">
        <h3 style={{ marginBottom: '4px' }}>📚 Subject Library & Practice Center</h3>
        <p style={{ fontSize: '13px', marginBottom: '20px' }}>
          Select a subject card below to enter focused practice mode for specific question decks.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button
            onClick={() => {
              playClickSound();
              setSelectedPracticeSubjectId('all');
              setMascotMsg('Now practicing all subjects in the pool! 🦉📚');
            }}
            className={`duo-btn-gray ${selectedPracticeSubjectId === 'all' ? 'active' : ''}`}
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            Practice All Subjects ({flashcards.length})
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {(academicResources?.subjects || []).map((subj) => {
            const count = flashcards.filter((fc) => fc.subjectId === subj.id).length;
            const isCurrent = selectedPracticeSubjectId === subj.id;
            return (
              <div
                key={subj.id}
                style={{
                  border: isCurrent ? '2px solid var(--duo-purple)' : '2px solid var(--border-color)',
                  borderBottom: isCurrent ? '5px solid var(--duo-purple)' : '4px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '16px',
                  backgroundColor: isCurrent ? 'rgba(142,125,190,0.04)' : 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>📖 {subj.name}</strong>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--border-color)',
                        fontWeight: 800,
                      }}
                    >
                      {count} MCQs
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <strong>Books:</strong> {subj.books.join(', ')}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <strong>Topics:</strong> {subj.chapters.join(', ')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedPracticeSubjectId(subj.id);
                    setMascotMsg(`Loaded focused deck for ${subj.name}! Ready to study. 🦉✨`);
                  }}
                  className={isCurrent ? 'duo-btn-purple' : 'duo-btn-teal'}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '12px' }}
                >
                  {isCurrent ? 'Practicing...' : 'Practice Deck'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flashcards AI Generator & Review Deck */}
      <div className="duo-card" data-testid="flashcards-card">
        <h3>AI Study Flashcard Center</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          Generate cognitive retrieval flashcards based on reference books and topics.
        </p>

        <div style={{ marginBottom: '24px' }}>
          {/* Generator Panel */}
          <div style={{ padding: '4px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 800,
                display: 'block',
                marginBottom: '12px',
                color: 'var(--duo-teal)',
              }}
            >
              ⚡ AI Flashcard Generator
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, marginBottom: '4px' }}>
                  Select Subject
                </label>
                <select
                  className="academics-select"
                  value={genSubjectId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    setGenSubjectId(sid);
                    const subj = (academicResources?.subjects || []).find((s) => s.id === sid);
                    setGenBookName(subj && subj.books.length > 0 ? subj.books[0] : '');
                    setGenChapterName(subj && subj.chapters.length > 0 ? subj.chapters[0] : '');
                  }}
                >
                  <option value="">-- Choose Subject --</option>
                  {(academicResources?.subjects || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {genSubjectId && (
                <>
                  <div>
                    <label
                      style={{ display: 'block', fontSize: '11px', fontWeight: 800, marginBottom: '4px' }}
                    >
                      Select Reference Book
                    </label>
                    <select
                      className="academics-select"
                      value={genBookName}
                      onChange={(e) => setGenBookName(e.target.value)}
                    >
                      <option value="">-- Choose Book --</option>
                      {(academicResources?.subjects || [])
                        .find((s) => s.id === genSubjectId)
                        ?.books.map((b, i) => (
                          <option key={i} value={b}>
                            {b}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{ display: 'block', fontSize: '11px', fontWeight: 800, marginBottom: '4px' }}
                    >
                      Select Chapter/Topic
                    </label>
                    <select
                      className="academics-select"
                      value={genChapterName}
                      onChange={(e) => setGenChapterName(e.target.value)}
                    >
                      <option value="">-- Choose Chapter --</option>
                      {(academicResources?.subjects || [])
                        .find((s) => s.id === genSubjectId)
                        ?.chapters.map((c, i) => (
                          <option key={i} value={c}>
                            {c}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              )}

              <button
                disabled={!genSubjectId || !genBookName || !genChapterName}
                onClick={() => {
                  playClickSound();
                  handleGenerateFlashcards(genSubjectId, genBookName, genChapterName);
                }}
                className="duo-btn-teal"
                style={{ width: '100%', marginTop: '8px' }}
              >
                Generate AI Flashcards
              </button>
            </div>
          </div>
        </div>

        {/* Flashcard Active Review Area */}
        <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '20px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 800,
              display: 'block',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            🎴 Active Flashcard Stack (
            {selectedPracticeSubjectId === 'all'
              ? 'All Subjects'
              : (academicResources?.subjects || []).find((s) => s.id === selectedPracticeSubjectId)?.name ||
                'Subject'}
            : {filteredFlashcards.length} Cards)
          </span>

          {filteredFlashcards.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                padding: '30px 0',
              }}
            >
              No flashcards available for this subject. Select another subject or generate some cards above!
            </p>
          ) : (
            <FlashcardViewer
              flashcards={filteredFlashcards}
              onMaster={handleMasterFlashcard}
              onReviewLater={handleReviewLaterFlashcard}
            />
          )}
        </div>
      </div>
    </div>
  );
});

AcademicsTab.displayName = 'AcademicsTab';
