import './TechnologyNotes.css';

function TechnologyNotes({ techId, notes, onNotesChange }) {
  return (
    <div className="notes-section" onClick={(e) => e.stopPropagation()}>
      <h4>Мои заметки:</h4>
      <textarea
        value={notes || ''}
        onChange={(e) => onNotesChange(techId, e.target.value)}
        placeholder="Записывайте сюда важные моменты..."
        rows="3"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="notes-hint">
        {notes && notes.length > 0 
          ? `Заметка сохранена (${notes.length} символов)` 
          : 'Добавьте заметку'}
      </div>
    </div>
  );
}

export default TechnologyNotes;