// src/SortableItem.jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id, item, onSelect, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '0.5rem',
    marginBottom: '0.5rem',
    background: '#f0f0f0',
    borderRadius: '0.5rem',
    cursor: 'grab',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span onClick={() => onSelect(item)} style={{ flexGrow: 1 }}>
        <strong>{item.numero}</strong> {item.titulo}
      </span>
      <button
        onClick={() => onDelete(item.id)}
        style={{ marginLeft: '1rem', color: 'red' }}
      >
        🗑️
      </button>
    </li>
  );
}
