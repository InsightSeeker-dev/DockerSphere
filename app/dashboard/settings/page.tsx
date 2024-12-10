'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      await update(data);

      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="max-w-xs"
              />
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </div>

            {/* Password Change */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <Input
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">New Password</label>
                <Input
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}