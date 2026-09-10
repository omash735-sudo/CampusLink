// app/admin/settings/security/page.tsx
import ChangePasswordForm from './ChangePasswordForm';

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security</h1>
        <p className="text-sm text-gray-500">Change your admin password</p>
      </div>

      <div className="bg-white border border-gray-200 p-6 max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
