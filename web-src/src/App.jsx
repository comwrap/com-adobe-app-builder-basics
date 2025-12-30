import React, { useState, useEffect } from 'react';
import {
  Provider,
  defaultTheme,
  Flex,
  View,
  Heading,
  TextField,
  Picker,
  Item,
  Button,
  TableView,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  ActionButton,
  Text,
  ProgressCircle,
  FileTrigger,
  Avatar
} from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';

// API endpoints
const API_BASE = '/api/v1/web/simpleApp';

function App() {
  const [name, setName] = useState('');
  const [active, setActive] = useState('Yes');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);


  // Get auth headers
  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const ims = window.imsCredentials;
    if (ims && ims.token) {
      headers['Authorization'] = 'Bearer ' + ims.token;
      headers['x-gw-ims-org-id'] = ims.org || '';
    }
    return headers;
  };

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/list-users`, {
        headers: getHeaders()
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    
    const payload = { name: name.trim(), active };

     // Add avatar if selected
     if (avatarFile) {
        payload.avatar = await fileToBase64(avatarFile);
        payload.avatarFileName = avatarFile.name;
      }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/save-user`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: name.trim(), active })
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setName('');
      setActive('Yes');
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/delete-user`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id })
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle avatar file selection
  const handleAvatarSelect = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      setAvatarFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <View padding="size-400">
        <Heading level={1} marginBottom="size-300">User Management</Heading>
        
        {/* Form Section */}
        <View 
          backgroundColor="gray-50" 
          padding="size-300" 
          borderRadius="medium"
          marginBottom="size-400"
        >
          <Flex direction="row" gap="size-200" alignItems="end" wrap>
            <TextField
              label="Name"
              value={name}
              onChange={setName}
              width="size-3000"
            />
            
            <Picker
              label="Active"
              selectedKey={active}
              onSelectionChange={setActive}
              width="size-1600"
            >
              <Item key="Yes">Yes</Item>
              <Item key="No">No</Item>
            </Picker>
            
            <View>
              <Text UNSAFE_style={{ fontSize: '12px', fontWeight: 500, marginBottom: '4px', display: 'block' }}>
                Avatar
              </Text>
              <Flex alignItems="center" gap="size-100">
                <FileTrigger
                  acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png']}
                  onSelect={(e) => {
                    if (e) {
                      const files = Array.from(e);
                      handleAvatarSelect(files);
                    }
                  }}
                >
                  <Button variant="secondary">
                    {avatarFile ? 'Change Avatar' : 'Select Avatar'}
                  </Button>
                </FileTrigger>
                {avatarPreview && (
                  <Avatar src={avatarPreview} alt="Avatar preview" size="avatar-size-400" />
                )}
              </Flex>
            </View>
            
            <Button 
              variant="cta" 
              onPress={handleSave}
              isDisabled={!name.trim() || saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Flex>
        </View>

        {/* Table Section */}
        {loading ? (
          <Flex justifyContent="center" marginTop="size-500">
            <ProgressCircle aria-label="Loading users" isIndeterminate />
          </Flex>
        ) : (
          <TableView
            aria-label="User data table"
            selectionMode="none"
            height="size-4600"
          >
            <TableHeader>
              <Column key="avatar" width="80px" align="center">Avatar</Column>
              <Column key="name" width="2fr">Name</Column>
              <Column key="active" width="1fr">Active</Column>
              <Column key="action" width="1fr" align="center">Action</Column>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <Row key={user.id}>
                 <Cell>
                    {user.avatarUrl ? (
                      <Avatar src={user.avatarUrl} alt={`${user.name}'s avatar`} size="avatar-size-400" />
                    ) : (
                      <Avatar alt="No avatar" size="avatar-size-400" />
                    )}
                  </Cell>
                  <Cell>{user.name}</Cell>
                  <Cell>{user.active}</Cell>
                  <Cell>
                    <ActionButton
                      isQuiet
                      onPress={() => handleDelete(user.id)}
                    >
                      <Delete />
                      <Text>Delete</Text>
                    </ActionButton>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </TableView>
        )}
      </View>
    </Provider>
  );
}

export default App;
