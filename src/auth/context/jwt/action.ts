import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  national_id: string;
  phone: string;
  country_id: string;
  nationality_id: string;
  currency_id: string;
  type: string;
  password_confirmation: string;
  gender: string;
  birth_date?: string;
  referral_code?: string;
};

export type ResetPasswordRequestParams = {
  email: string;
};

export type UploadAvatarParams = {
  avatar: File;
};

export type UpdatePasswordParams = {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
};

export type VerifyEmailParams = {
  email: string;
  token: string;
};

export type resendVerificationEmailParams = {
  email: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { token } = res.data.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    setSession(token);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  name,
  lastName,
  email,
  password,
  national_id,
  phone,
  country_id,
  nationality_id,
  currency_id,
  type,
  password_confirmation,
  gender,
  birth_date,
  referral_code,
}: SignUpParams): Promise<void> => {
  const params = {
    name,
    lastName,
    email,
    password,
    national_id,
    phone,
    country_id,
    nationality_id,
    currency_id,
    type,
    password_confirmation,
    gender,
    ...(birth_date && { birth_date }), // Only include if present
    referral_code,
  };

  try {
    await axios.post(endpoints.auth.signUp, params);

    console.log('Sign up successful');
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

/** **************************************
 * Reset password request
 *************************************** */

export const requestPasswordReset = async ({ email }: ResetPasswordRequestParams): Promise<any> => {
  try {
    const params = { email };

    const res = await axios.post(endpoints.auth.resetPasswordRequest, params);

    const { success } = res.data;

    if (!success) {
      throw new Error('Password reset request failed');
    }
    return res.data;
  } catch (error) {
    console.error('Error during password reset request:', error);
    throw error;
  }
};

/** **************************************
 * Reset password
 *************************************** */

export const updatePassword = async ({
  email,
  token,
  password,
  password_confirmation,
}: UpdatePasswordParams): Promise<any> => {
  try {
    const params = {
      email,
      token,
      password,
      password_confirmation,
    };

    const res = await axios.post(endpoints.auth.updatePassword, params);

    const { success } = res.data;
    if (!success) {
      throw new Error('Password reset failed');
    }
    return res.data;
  } catch (error) {
    console.error('Error during password reset:', error);
    throw error;
  }
};

/** **************************************
 * Verify email
 *************************************** */

export const verifyEmail = async ({ email, token }: VerifyEmailParams): Promise<any> => {
  try {
    const params = { email, token };

    const res = await axios.post(endpoints.auth.verifyEmail, params);

    const { success } = res.data;

    if (!success) {
      throw new Error('Verify email failed');
    }
    return res.data;
  } catch (error) {
    console.error('Error during verify email:', error);
    throw error;
  }
};

/** **************************************
 * Resend Verify email
 *************************************** */

export const resendVerificationEmail = async ({
  email,
}: resendVerificationEmailParams): Promise<any> => {
  try {
    const params = { email };

    const res = await axios.post(endpoints.auth.resendVerificationEmail, params);

    const { success } = res.data;

    if (!success) {
      throw new Error('Resend verification email failed');
    }
    return res.data;
  } catch (error) {
    console.error('Error during resend verification email:', error);
    throw error;
  }
};


/** **************************************
 * Upload Avatar
 *************************************** */
export const uploadAvatar = async ({ avatar }: UploadAvatarParams): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatar);

    const res = await axios.post(endpoints.auth.uploadAvatar, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { success } = res.data;

    if (!success) {
      throw new Error('Upload avatar failed');
    }
    return res.data;
  } catch (error) {
    console.error('Error during upload avatar:', error);
    throw error;
  }
};
