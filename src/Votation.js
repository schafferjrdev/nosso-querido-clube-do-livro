import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const getItemStyle = (isDragging, draggableStyle, index) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  // padding: grid * 2,

  // change background colour if dragging
  background: "var(--bg)",
  boxShadow: !isDragging
    ? "none"
    : "6px 6px 12px var(--shadow), -6px -6px 12px var(--light)",

  border: !isDragging ? "1px solid var(--shadow)" : "1px solid transparent",
  "&:hover": { background: "red" },
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  borderRadius: "8px",
  paddingLeft: "0.5rem",
  margin: "16px 0",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  // background: isDraggingOver ? "#ecf0f3" : "#242424",
  boxShadow: isDraggingOver
    ? "inset 6px 6px 12px var(--shadow),  inset -6px -6px 12px var(--light)"
    : "6px 6px 12px var(--shadow), -6px -6px 12px var(--light)",
  padding: "12px 24px",
});

function Book({ book, index }) {
  return (
    <Draggable draggableId={book.nome} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style,
            index
          )}
          className="votation-option"
        >
          <span className="list-text">{index + 1}º</span>
          <span
            className="list-text"
            style={{
              marginLeft: "0.5rem",
            }}
          >
            {book.nome}, {book.autor}
          </span>
        </div>
      )}
    </Draggable>
  );
}

const BookList = React.memo(function BookList({ books }) {
  return books.map((book, index) => (
    <Book book={book} index={index} key={book.nome} />
  ));
});

function BookApp({ books, handleSort }) {
  async function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    handleSort(result.source.index, result.destination.index);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="list-style"
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <BookList books={books} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default BookApp;
