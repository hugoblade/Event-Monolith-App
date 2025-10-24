import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, StyleSheet } from 'react-native';
import api from '../services/api';
import ws from '../services/ws';
import { useAuth } from '../context/AuthContext';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  approved: boolean;
};

export default function EventListScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchEvents();
    // connect WS
    ws.connect();
    const onEventMessage = (message: any) => {
      // adjust according to your backend message shape
      if (message.channel === 'events') {
        if (message.type === 'created') {
          setEvents(prev => [message.payload, ...prev]);
        } else if (message.type === 'updated') {
          setEvents(prev => prev.map(e => (e.id === message.payload.id ? message.payload : e)));
        } else if (message.type === 'deleted') {
          setEvents(prev => prev.filter(e => e.id !== message.payload.id));
        }
      }
    };
    ws.on('events', onEventMessage);

    return () => {
      ws.off('events', onEventMessage);
      // optional: ws.disconnect();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <Button title="Sign Out" onPress={signOut} />
      </View>

      {user?.role === 'ORGANIZER' && <Button title="Create Event" onPress={() => { /* navigate to create screen */ }} />}
      {user?.role === 'ADMIN' && <Text style={styles.adminHint}>You are an Admin - you can approve events</Text>}

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{new Date(item.date).toLocaleString()}</Text>
            <Text>{item.approved ? 'Approved' : 'Pending'}</Text>
            {/* Add buttons to RSVP, Edit or Approve depending on user.role */}
          </View>
        )}
        refreshing={loading}
        onRefresh={fetchEvents}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22 },
  adminHint: { color: 'green' },
  card: { padding: 12, borderWidth: 1, marginTop: 8, borderRadius: 6 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
});
