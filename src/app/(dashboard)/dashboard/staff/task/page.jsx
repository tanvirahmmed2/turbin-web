'use client';

import { useState } from 'react';

export default function StaffTasks() {
  // Mock state since there is no tour_tasks table
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Prepare equipment for Mt Fuji Tour', description: 'Check headsets, radios, and emergency kits.', status: 'todo', priority: 'high' },
    { id: 2, title: 'Confirm restaurant booking for Group A', description: 'Call the Shibuya restaurant to confirm 12 pax at 6PM.', status: 'in_progress', priority: 'medium' },
    { id: 3, title: 'Print manifests for tomorrow', description: 'Print the guest lists for all 3 morning tours.', status: 'done', priority: 'low' },
  ]);

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const Column = ({ title, statusId }) => {
    const columnTasks = tasks.filter(t => t.status === statusId);
    
    return (
      <div className="bg-gray-700 rounded-3xl border border-[#222] p-4 flex flex-col h-full min-h-[500px]">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <span className="bg-gray-800 text-gray-400 text-xs py-1 px-2 rounded-full">{columnTasks.length}</span>
        </div>
        
        <div className="flex-1 space-y-4">
          {columnTasks.map(task => (
            <div key={task.id} className="bg-gray-800 rounded-2xl p-5 border border-[#333] hover:border-gray-500 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border 
                  ${task.priority === 'high' ? 'bg-red-900/30 text-red-400 border-red-500/20' : 
                    task.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/20' : 
                    'bg-gray-700 text-gray-300 border-gray-600'}`}>
                  {task.priority} Priority
                </span>
              </div>
              <h3 className="text-md font-bold text-white mb-2">{task.title}</h3>
              <p className="text-xs text-gray-400 mb-4">{task.description}</p>
              
              {/* Kanban controls */}
              <div className="flex justify-end gap-2 border-t border-[#333] pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {statusId !== 'todo' && (
                  <button onClick={() => updateTaskStatus(task.id, statusId === 'done' ? 'in_progress' : 'todo')} className="text-xs text-gray-400 hover:text-white">
                    &larr; Move Back
                  </button>
                )}
                {statusId !== 'done' && (
                  <button onClick={() => updateTaskStatus(task.id, statusId === 'todo' ? 'in_progress' : 'done')} className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                    Move Next &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
          {columnTasks.length === 0 && (
            <div className="text-center p-8 text-gray-600 text-sm border-2 border-dashed border-[#333] rounded-2xl">
              No tasks
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Task Board</h1>
          <p className="mt-1 text-gray-400">Manage your daily operational tasks and assignments.</p>
        </div>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">
          + New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="To Do" statusId="todo" />
        <Column title="In Progress" statusId="in_progress" />
        <Column title="Done" statusId="done" />
      </div>
    </div>
  );
}
