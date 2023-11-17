'use client';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { push, ref, set, get, onValue, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import Script from 'next/script'
import { database } from '../../firebaseConfig';
import { DragDropContext, Droppable, Draggable, resetServerContext } from "react-beautiful-dnd";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const tasks = [
    { id: "1", content: "First task", description: "Test 1" },
    { id: "2", content: "Second task", description: "Test 2" },
    { id: "3", content: "Third task", description: "" },
    { id: "4", content: "Fourth task", description: "" },
    { id: "5", content: "Fifth task", description: "" }
  ];
  
  const taskStatus = {
    atoDo: {
      name: "To Do",
      items: []
    },
    bInProgress: {
      name: "In Progress",
      items: []
    },
    cTesting: {
      name: "Testing",
      items: []
    },
    dDone: {
      name: "Done",
      items: []
    }
  };

  const removeOldAddNew = async (newData) => {
    const tasksRef = ref(database, 'Tasks');
  
    try {
      const snapshot = await get(tasksRef);
      const data = snapshot.val();
  
      if (data) {
        Object.keys(data).forEach((key) => {
          set(ref(database, `Tasks/${key}`), null);
        });
      }

      const newDataRef = push(tasksRef);
      await set(newDataRef, newData);
      console.log("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const addNewItem = () => {
    const newContent = prompt("Enter task content:");
    const newDescription = prompt("Enter task description:");
    if (newContent !== null) {
      const newItem = {
        id: `${Date.now()}`,
        content: newContent,
        description: newDescription
      };

      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };
        newColumns.atoDo.items = [...newColumns.atoDo.items, newItem];
        removeOldAddNew(newColumns)
        return newColumns;
      });
    }
  };

  const editItem = (columnId, itemId) => {
    const column = columns[columnId];
    const itemToEdit = column.items.find((item) => item.id === itemId);

    if (!itemToEdit) {
      alert("Item not found!");
      return;
    }

    const newContent = prompt("Edit task content:", itemToEdit.content);
    const newDescription = prompt(
      "Edit task description:",
      itemToEdit.description
    );

    if (newContent !== null && newDescription !== null) {
      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };
        const editedItems = column.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              content: newContent,
              description: newDescription
            };
          }
          return item;
        });
        newColumns[columnId] = { ...column, items: editedItems };
        removeOldAddNew(newColumns)
        return newColumns;
      });
    }
  };

  const deleteItem = (columnId, itemId) => {
    const column = columns[columnId];
    const itemToDelete = column.items.find((item) => item.id === itemId);

    if (!itemToDelete) {
      alert("Item not found!");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the task: ${itemToDelete.content}?`
    );

    if (confirmDelete) {
      setColumns((prevColumns) => {
        const newColumns = { ...prevColumns };
        const updatedItems = column.items.filter((item) => item.id !== itemId);
        newColumns[columnId] = { ...column, items: updatedItems };
        removeOldAddNew(newColumns)
        return newColumns;
      });
    }
  };
  
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
  
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
      removeOldAddNew({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      })
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
      removeOldAddNew({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };
  
  const [columns, setColumns] = useState(taskStatus);

  useEffect(() => {
    onValue(ref(database, 'Tasks'), (snapshot) => {
      let data = snapshot.val();
      if(!!data){
        if(Object.keys(data).length>0){
          let tempData;
          Object.keys(data).map((item,index)=>{
            tempData = data[item]
          })
          Object.keys(tempData).map((item,index)=>{
            if(!!!tempData[item].items){
              tempData[item].items = []
            }
          })
          setColumns(tempData)
        }
      }
    });
  }, [])

  resetServerContext()
  
  return (
    <>
      <Head>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'/>
        <meta name="coordify" content="coordify" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="coordify" />
        <meta name="description" content="coordify" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2E2E2E" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <Script src="https://www.gstatic.com/firebasejs/8.2.3/firebase-auth.js"></Script>
        <Script src="https://www.gstatic.com/firebasejs/8.2.3/firebase-database.js"></Script>
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        
      <div>
        <h1 style={{ textAlign: "center", marginBottom: '2rem', width: "100%" }}>
          <span>Coordify: Task Planner <h6 style={{fontSize: '14px'}}>Made with 🤍 by Priyanshu Singh Chauhan (2021MT93706)</h6></span>
          <button className='btn-cta' style={{marginLeft: 'auto', display: 'block'}} onClick={()=>{addNewItem()}}>Add Task</button>
        </h1>
        <div
          style={{ display: "flex", justifyContent: "center", height: "100%" }}
        >
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                  key={columnId}
                >
                  <h2>{column.name}</h2>
                  <div style={{ margin: 8 }}>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "lightblue"
                                : "lightgrey",
                              padding: 4,
                              width: 250,
                              minHeight: 500,
                              maxHeight: 500,
                              overflowY: 'auto',
                            }}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: "none",
                                          padding: 16,
                                          margin: "0 0 8px 0",
                                          minHeight: "50px",
                                          backgroundColor: snapshot.isDragging
                                            ? "#263B4A"
                                            : "#456C86",
                                          color: "white",
                                          ...provided.draggableProps.style
                                        }}
                                      >
                                        {item.content}
                                        <p style={{fontSize: 12}}>{item.description}</p>

                                        <button
                                          className='btn-cta'
                                          onClick={() =>
                                            editItem(columnId, item.id)
                                          }
                                        >
                                          Edit
                                        </button>

                                        <button
                                          className='btn-cta'
                                          onClick={() =>
                                            deleteItem(columnId, item.id)
                                          }
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        </div>
      </div>
      </main>
    </>
  )
}
