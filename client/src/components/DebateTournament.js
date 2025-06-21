import React, { useState, useEffect } from 'react';
import { useTranslation } from '../services/TranslationService';
import './DebateTournament.css';

const DebateTournament = ({ onClose, currentUser }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [tournamentForm, setTournamentForm] = useState({
    name: '',
    description: '',
    maxParticipants: 16,
    topic: '',
    startDate: '',
    endDate: '',
    prize: '',
    rules: ''
  });

  // Sample tournament data
  const [tournaments] = useState([
    {
      id: 1,
      name: 'Climate Action Championship',
      description: 'A competitive debate tournament focused on climate change solutions and policies.',
      status: 'active',
      participants: 12,
      maxParticipants: 16,
      topic: 'Should governments implement carbon taxes to combat climate change?',
      startDate: '2024-02-15',
      endDate: '2024-02-20',
      prize: '$1000 + Trophy',
      rules: 'Single elimination bracket, 10-minute arguments, 5-minute rebuttals',
      rounds: [
        { round: 1, matches: 8, completed: 8 },
        { round: 2, matches: 4, completed: 4 },
        { round: 3, matches: 2, completed: 2 },
        { round: 4, matches: 1, completed: 0 }
      ],
      participants: [
        { username: 'ClimateExpert', wins: 3, losses: 0, points: 450 },
        { username: 'PolicyAnalyst', wins: 3, losses: 0, points: 420 },
        { username: 'GreenAdvocate', wins: 2, losses: 1, points: 380 },
        { username: 'EcoWarrior', wins: 2, losses: 1, points: 360 }
      ]
    },
    {
      id: 2,
      name: 'Tech Ethics Debate League',
      description: 'Exploring the ethical implications of emerging technologies.',
      status: 'upcoming',
      participants: 8,
      maxParticipants: 16,
      topic: 'Should AI development be regulated by international bodies?',
      startDate: '2024-03-01',
      endDate: '2024-03-05',
      prize: '$500 + Certificate',
      rules: 'Round-robin format, 15-minute debates, audience voting',
      participants: [
        { username: 'TechEthicist', wins: 0, losses: 0, points: 0 },
        { username: 'AIFuturist', wins: 0, losses: 0, points: 0 },
        { username: 'DigitalPhilosopher', wins: 0, losses: 0, points: 0 },
        { username: 'CodeMoralist', wins: 0, losses: 0, points: 0 }
      ]
    },
    {
      id: 3,
      name: 'Healthcare Policy Masters',
      description: 'Advanced debate tournament for healthcare policy experts.',
      status: 'completed',
      participants: 8,
      maxParticipants: 8,
      topic: 'Should universal healthcare be implemented nationwide?',
      startDate: '2024-01-10',
      endDate: '2024-01-15',
      prize: '$750 + Medal',
      rules: 'Double elimination, 20-minute arguments, expert judges',
      winner: 'HealthPolicyGuru',
      runnerUp: 'MedicalEthicist',
      participants: [
        { username: 'HealthPolicyGuru', wins: 4, losses: 0, points: 520, position: 1 },
        { username: 'MedicalEthicist', wins: 3, losses: 1, points: 480, position: 2 },
        { username: 'PublicHealthAdvocate', wins: 2, losses: 2, points: 420, position: 3 },
        { username: 'HealthcareAnalyst', wins: 1, losses: 2, points: 380, position: 4 }
      ]
    }
  ]);

  const handleCreateTournament = (e) => {
    e.preventDefault();
    // Here you would typically send the tournament data to your backend
    console.log('Creating tournament:', tournamentForm);
    setShowCreateTournament(false);
    setTournamentForm({
      name: '',
      description: '',
      maxParticipants: 16,
      topic: '',
      startDate: '',
      endDate: '',
      prize: '',
      rules: ''
    });
  };

  const handleJoinTournament = (tournamentId) => {
    // Here you would typically send a join request to your backend
    console.log('Joining tournament:', tournamentId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'upcoming': return '#f59e0b';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const filteredTournaments = tournaments.filter(t => t.status === activeTab);

  return (
    <div className="debate-tournament-overlay" onClick={onClose}>
      <div className="debate-tournament-modal" onClick={(e) => e.stopPropagation()}>
        <div className="debate-tournament-header">
          <button className="close-tournament-btn" onClick={onClose}>×</button>
          <h2>🏆 Debate Tournaments</h2>
          <p>Compete in structured debate tournaments and win prizes</p>
        </div>

        <div className="debate-tournament-content">
          {/* Tab Navigation */}
          <div className="tournament-tabs">
            <button 
              className={`tournament-tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              🔥 Active ({tournaments.filter(t => t.status === 'active').length})
            </button>
            <button 
              className={`tournament-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              📅 Upcoming ({tournaments.filter(t => t.status === 'upcoming').length})
            </button>
            <button 
              className={`tournament-tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              ✅ Completed ({tournaments.filter(t => t.status === 'completed').length})
            </button>
          </div>

          {/* Create Tournament Button */}
          <div className="tournament-actions">
            <button 
              className="create-tournament-btn"
              onClick={() => setShowCreateTournament(true)}
            >
              🏆 Create Tournament
            </button>
          </div>

          {/* Tournament List */}
          <div className="tournament-list">
            {filteredTournaments.map(tournament => (
              <div key={tournament.id} className="tournament-card">
                <div className="tournament-header">
                  <div className="tournament-info">
                    <h3>{tournament.name}</h3>
                    <p>{tournament.description}</p>
                    <div className="tournament-meta">
                      <span className="tournament-status" style={{ color: getStatusColor(tournament.status) }}>
                        {getStatusLabel(tournament.status)}
                      </span>
                      <span className="tournament-participants">
                        {tournament.participants.length}/{tournament.maxParticipants} participants
                      </span>
                      <span className="tournament-prize">🏆 {tournament.prize}</span>
                    </div>
                  </div>
                  <div className="tournament-actions">
                    {tournament.status === 'upcoming' && (
                      <button 
                        className="join-tournament-btn"
                        onClick={() => handleJoinTournament(tournament.id)}
                      >
                        Join Tournament
                      </button>
                    )}
                    <button 
                      className="view-tournament-btn"
                      onClick={() => setSelectedTournament(tournament)}
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="tournament-details">
                  <div className="tournament-topic">
                    <strong>Topic:</strong> {tournament.topic}
                  </div>
                  <div className="tournament-dates">
                    <span>📅 {tournament.startDate} - {tournament.endDate}</span>
                  </div>
                  <div className="tournament-rules">
                    <strong>Rules:</strong> {tournament.rules}
                  </div>
                </div>

                {/* Tournament Progress */}
                {tournament.status === 'active' && tournament.rounds && (
                  <div className="tournament-progress">
                    <h4>Tournament Progress</h4>
                    <div className="rounds-progress">
                      {tournament.rounds.map(round => (
                        <div key={round.round} className="round-item">
                          <span className="round-label">Round {round.round}</span>
                          <div className="round-bar">
                            <div 
                              className="round-fill" 
                              style={{ width: `${(round.completed / round.matches) * 100}%` }}
                            ></div>
                          </div>
                          <span className="round-status">{round.completed}/{round.matches}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leaderboard */}
                {tournament.participants && tournament.participants.length > 0 && (
                  <div className="tournament-leaderboard">
                    <h4>Leaderboard</h4>
                    <div className="leaderboard-list">
                      {tournament.participants
                        .sort((a, b) => b.points - a.points)
                        .slice(0, 5)
                        .map((participant, index) => (
                          <div key={participant.username} className="leaderboard-item">
                            <span className="leaderboard-rank">#{index + 1}</span>
                            <span className="leaderboard-username">{participant.username}</span>
                            <span className="leaderboard-stats">
                              {participant.wins}W - {participant.losses}L
                            </span>
                            <span className="leaderboard-points">{participant.points} pts</span>
                            {participant.position && (
                              <span className="leaderboard-position">
                                {participant.position === 1 ? '🥇' : 
                                 participant.position === 2 ? '🥈' : 
                                 participant.position === 3 ? '🥉' : ''}
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Create Tournament Modal */}
          {showCreateTournament && (
            <div className="create-tournament-modal">
              <div className="create-tournament-content">
                <h3>Create New Tournament</h3>
                <form onSubmit={handleCreateTournament}>
                  <div className="form-group">
                    <label>Tournament Name</label>
                    <input
                      type="text"
                      value={tournamentForm.name}
                      onChange={(e) => setTournamentForm({...tournamentForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={tournamentForm.description}
                      onChange={(e) => setTournamentForm({...tournamentForm, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Max Participants</label>
                      <select
                        value={tournamentForm.maxParticipants}
                        onChange={(e) => setTournamentForm({...tournamentForm, maxParticipants: parseInt(e.target.value)})}
                      >
                        <option value={8}>8</option>
                        <option value={16}>16</option>
                        <option value={32}>32</option>
                        <option value={64}>64</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Prize</label>
                      <input
                        type="text"
                        value={tournamentForm.prize}
                        onChange={(e) => setTournamentForm({...tournamentForm, prize: e.target.value})}
                        placeholder="e.g., $1000 + Trophy"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Debate Topic</label>
                    <input
                      type="text"
                      value={tournamentForm.topic}
                      onChange={(e) => setTournamentForm({...tournamentForm, topic: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={tournamentForm.startDate}
                        onChange={(e) => setTournamentForm({...tournamentForm, startDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={tournamentForm.endDate}
                        onChange={(e) => setTournamentForm({...tournamentForm, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Tournament Rules</label>
                    <textarea
                      value={tournamentForm.rules}
                      onChange={(e) => setTournamentForm({...tournamentForm, rules: e.target.value})}
                      placeholder="Describe the tournament format, rules, and scoring system..."
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowCreateTournament(false)}>
                      Cancel
                    </button>
                    <button type="submit">
                      Create Tournament
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tournament Details Modal */}
          {selectedTournament && (
            <div className="tournament-details-modal">
              <div className="tournament-details-content">
                <button className="close-details-btn" onClick={() => setSelectedTournament(null)}>×</button>
                <h3>{selectedTournament.name}</h3>
                <p>{selectedTournament.description}</p>
                
                <div className="details-grid">
                  <div className="detail-item">
                    <strong>Topic:</strong> {selectedTournament.topic}
                  </div>
                  <div className="detail-item">
                    <strong>Dates:</strong> {selectedTournament.startDate} - {selectedTournament.endDate}
                  </div>
                  <div className="detail-item">
                    <strong>Prize:</strong> {selectedTournament.prize}
                  </div>
                  <div className="detail-item">
                    <strong>Rules:</strong> {selectedTournament.rules}
                  </div>
                </div>

                {selectedTournament.status === 'upcoming' && (
                  <button className="join-tournament-btn-large">
                    Join Tournament
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebateTournament; 