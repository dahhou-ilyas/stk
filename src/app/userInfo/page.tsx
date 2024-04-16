"use client"
import React, { useState } from 'react';
import { useAuth } from '@/store/auth-context';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, User, updateEmail } from 'firebase/auth';
import Spinner from '@/components/spinner';

function UserInfo() {
    const { user } = useAuth();
    console.log(user);
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleDisplayNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(e.target.value);
    };

    const handleEmailChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePhoneNumberChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handlePhotoURLChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPhotoURL(e.target.value);
    };

    const handleCurrentPasswordChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPassword(e.target.value);
    };

    const handleNewPasswordChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateProfile(user as User, { displayName, photoURL });

            // Update email and/or phone number
            if (user?.email !== email || user.phoneNumber !== phoneNumber) {
                // Re-authenticate user
                const credential = EmailAuthProvider.credential(user?.email as string, currentPassword);
                await reauthenticateWithCredential(user as User, credential);

                // Update email
                if (user?.email !== email) {
                    await updateEmail(user as User, email);
                }

                // Update phone number
                if (user?.phoneNumber !== phoneNumber) {
                    // Update phone number logic
                }
            }

            // Update password
            if (newPassword) {
                await updatePassword(user as User, newPassword);
            }

            console.log('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return <Spinner />;
    }

    return (
        <div className='h-[90%] min-w-[70%]'>
            <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center font-mono h-[100%] gap-y-9 -mt-3'>
                <h2 className='text-2xl'>
                    <span className='text-accent'>Email : </span>
                    {user.email}
                </h2>
                <div className='flex flex-row justify-center items-center'>
                    <label htmlFor='displayName' className='text-xl text-accent'>
                        Display Name :
                    </label>
                    <input
                        type='text'
                        id='displayName'
                        value={displayName}
                        onChange={handleDisplayNameChange}
                        className='border border-gray-400 rounded-md p-2 ml-4'
                    />
                </div>
                <div className='flex flex-row justify-center items-center'>
                    <label htmlFor='phoneNumber' className='text-xl text-accent'>
                        Phone Number :
                    </label>
                    <input
                        type='text'
                        id='phoneNumber'
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className='border border-gray-400 rounded-md p-2 ml-4'
                    />
                </div>
                <div className='flex flex-row justify-center items-center'>
                    <label htmlFor='photoURL' className='text-xl text-accent'>
                        Photo URL :
                    </label>
                    <input
                        type='text'
                        id='photoURL'
                        value={photoURL}
                        onChange={handlePhotoURLChange}
                        className='border border-gray-400 rounded-md p-2 ml-4'
                    />
                </div>
                <div className='flex flex-row justify-center items-center'>
                    <label htmlFor='currentPassword' className='text-xl text-accent'>
                        Current Password :
                    </label>
                    <input
                        type='password'
                        id='currentPassword'
                        value={currentPassword}
                        onChange={handleCurrentPasswordChange}
                        className='border border-gray-400 rounded-md p-2 ml-4'
                    />
                </div>
                <div className='flex flex-row justify-center items-center'>
                    <label htmlFor='newPassword' className='text-xl text-accent'>
                        New Password :
                    </label>
                    <input
                        type='password'
                        id='newPassword'
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        className='border border-gray-400 rounded-md p-2 ml-4'
                    />
                </div>
                <button type='submit' className='btn btn-primary mt-4'>
                    Update Profile
                </button>
            </form>
        </div>
    );
}

export default UserInfo;