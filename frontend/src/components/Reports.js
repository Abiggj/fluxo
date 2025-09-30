
import React from 'react';

const Reports = () => {
    return (
        <div id="reports" className="content-section">
            <div className="page-header">
                <h1 className="page-title">Analytics & Reports</h1>
                <p className="page-description">Project insights and team performance metrics</p>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px'}}>
                <div style={{background: 'white', border: '1px solid #e4e6ea', borderRadius: '4px', padding: '20px'}}>
                    <h3 style={{color: '#172b4d', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600}}>Total Tasks</h3>
                    <div style={{fontSize: '2rem', fontWeight: 700, color: '#0052cc', marginBottom: '4px'}}>47</div>
                    <div style={{fontSize: '0.8125rem', color: '#36b37e'}}>↗ +12% from last week</div>
                </div>
                
                <div style={{background: 'white', border: '1px solid #e4e6ea', borderRadius: '4px', padding: '20px'}}>
                    <h3 style={{color: '#172b4d', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600}}>Completed Tasks</h3>
                    <div style={{fontSize: '2rem', fontWeight: 700, color: '#36b37e', marginBottom: '4px'}}>23</div>
                    <div style={{fontSize: '0.8125rem', color: '#36b37e'}}>↗ +8% from last week</div>
                </div>
                
                <div style={{background: 'white', border: '1px solid #e4e6ea', borderRadius: '4px', padding: '20px'}}>
                    <h3 style={{color: '#172b4d', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600}}>In Progress</h3>
                    <div style={{fontSize: '2rem', fontWeight: 700, color: '#ff8b00', marginBottom: '4px'}}>15</div>
                    <div style={{fontSize: '0.8125rem', color: '#ff8b00'}}>→ No change</div>
                </div>
                
                <div style={{background: 'white', border: '1px solid #e4e6ea', borderRadius: '4px', padding: '20px'}}>
                    <h3 style={{color: '#172b4d', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600}}>Team Velocity</h3>
                    <div style={{fontSize: '2rem', fontWeight: 700, color: '#0052cc', marginBottom: '4px'}}>8.5</div>
                    <div style={{fontSize: '0.8125rem', color: '#36b37e'}}>↗ +0.5 from last sprint</div>
                </div>
            </div>
            
            <div style={{background: 'white', border: '1px solid #e4e6ea', borderRadius: '4px', padding: '24px'}}>
                <h3 style={{color: '#172b4d', marginBottom: '16px', fontSize: '1.125rem', fontWeight: 600}}>Project Timeline</h3>
                <p style={{color: '#5e6c84', fontSize: '0.875rem'}}>Detailed analytics and reporting features would be implemented here with charts and graphs showing project progress, team performance, and other key metrics.</p>
            </div>
        </div>
    );
}

export default Reports;
