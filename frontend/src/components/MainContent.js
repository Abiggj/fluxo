
import React from 'react';
import KanbanBoard from './KanbanBoard';
import Projects from './Projects';
import Team from './Team';
import Reports from './Reports';

const MainContent = ({ activeSection }) => {
    return (
        <div className="main-content">
            {activeSection === 'kanban' && <KanbanBoard />}
            {activeSection === 'projects' && <Projects />}
            {activeSection === 'team' && <Team />}
            {activeSection === 'reports' && <Reports />}
        </div>
    );
}

export default MainContent;
