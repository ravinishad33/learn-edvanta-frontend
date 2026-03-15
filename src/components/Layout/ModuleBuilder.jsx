import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  GripVertical,
  Video,
  FileText,
  Settings
} from 'lucide-react';

const ModuleBuilder = ({ modules, onModulesChange }) => {
  const [expandedModules, setExpandedModules] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: 'New Module',
      description: '',
      lessons: []
    };
    onModulesChange([...modules, newModule]);
    setExpandedModules([...expandedModules, newModule.id]);
  };

  const updateModule = (moduleId, updates) => {
    onModulesChange(
      modules.map(module =>
        module.id === moduleId ? { ...module, ...updates } : module
      )
    );
  };

  const deleteModule = (moduleId) => {
    onModulesChange(modules.filter(module => module.id !== moduleId));
    setExpandedModules(expandedModules.filter(id => id !== moduleId));
  };

  const addLesson = (moduleId) => {
    const newLesson = {
      id: Date.now(),
      title: 'New Lesson',
      type: 'video',
      duration: '',
      content: '',
      isPreview: false
    };
    
    updateModule(moduleId, {
      lessons: [...modules.find(m => m.id === moduleId).lessons, newLesson]
    });
  };

  const updateLesson = (moduleId, lessonId, updates) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      updateModule(moduleId, {
        lessons: module.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, ...updates } : lesson
        )
      });
    }
  };

  const deleteLesson = (moduleId, lessonId) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      updateModule(moduleId, {
        lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
      });
    }
  };

  const handleDragStart = (e, index) => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === dropIndex) return;
    
    const newModules = [...modules];
    const [draggedModule] = newModules.splice(draggingIndex, 1);
    newModules.splice(dropIndex, 0, draggedModule);
    
    onModulesChange(newModules);
    setDraggingIndex(null);
  };

  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <div
          key={module.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          className={`border rounded-lg bg-white ${
            draggingIndex === index ? 'opacity-50' : ''
          }`}
        >
          {/* Module Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <GripVertical className="text-gray-400 cursor-move" />
              <button
                onClick={() => toggleModule(module.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                {expandedModules.includes(module.id) ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>
              <input
                type="text"
                value={module.title}
                onChange={(e) => updateModule(module.id, { title: e.target.value })}
                className="text-lg font-semibold border-none focus:outline-none focus:ring-0 flex-1"
                placeholder="Module title"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {module.lessons.length} lessons
              </span>
              <button
                onClick={() => deleteModule(module.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Module Content (Collapsible) */}
          {expandedModules.includes(module.id) && (
            <div className="p-4 space-y-4">
              <div>
                <textarea
                  value={module.description}
                  onChange={(e) => updateModule(module.id, { description: e.target.value })}
                  placeholder="Module description (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />
              </div>

              {/* Lessons List */}
              <div className="space-y-3">
                {module.lessons.map((lesson) => (
                  <div key={lesson.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          {lesson.type === 'video' ? (
                            <Video size={18} className="text-red-500" />
                          ) : (
                            <FileText size={18} className="text-blue-500" />
                          )}
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                            className="font-medium border-none focus:outline-none focus:ring-0 flex-1"
                            placeholder="Lesson title"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => deleteLesson(module.id, lesson.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={lesson.type}
                          onChange={(e) => updateLesson(module.id, lesson.id, { type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                          <option value="quiz">Quiz</option>
                          <option value="assignment">Assignment</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                          placeholder="e.g., 15:30"
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={lesson.isPreview}
                            onChange={(e) => updateLesson(module.id, lesson.id, { isPreview: e.target.checked })}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <span className="text-sm text-gray-700">Preview Lesson</span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content/Description
                      </label>
                      <textarea
                        value={lesson.content}
                        onChange={(e) => updateLesson(module.id, lesson.id, { content: e.target.value })}
                        placeholder="Lesson content or description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addLesson(module.id)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-400 flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Lesson
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addModule}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-400 flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Module
      </button>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Tips for creating great course content:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Start with an introduction module to welcome students</li>
          <li>• Break complex topics into multiple lessons</li>
          <li>• Include a mix of video, text, and interactive content</li>
          <li>• Add practice exercises and quizzes</li>
          <li>• End with a summary and next steps</li>
        </ul>
      </div>
    </div>
  );
};

export default ModuleBuilder;