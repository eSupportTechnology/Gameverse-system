<x-mail::message>
# Hello {{ $name }},

Welcome to {{ config('app.name') }} 🎉  

Your account has been created successfully.  
Here is your **temporary password**:

---

**Email:** {{ $email }}  
**Temporary Password:** `{{ $tempPassword }}`  

---

⚠️ For security reasons, you will be asked to reset this password at your first login.

<x-mail::button :url="config('app.frontend_url') . '/admin/login'">
Login to Dashboard
</x-mail::button>


Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
