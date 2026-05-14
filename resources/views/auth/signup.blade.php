<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - SecureGate</title>
    <link rel="stylesheet" href="{{ asset('CSS/sign.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        if (localStorage.getItem('securegate_theme') === 'light') {
            document.documentElement.classList.add('light-mode');
        }
    </script>
</head>
<body>
    <nav class="navbar">
        <div class="left-nav">
            <h1>SecureGate</h1>
        </div>
        <div class="right-nav">
            <a href="{{ route('signin') }}">Sign In</a>
        </div>
    </nav>

    <nav class="sign-card" style="margin-top: 10px;">
        <img src="{{ asset('Media/SVG.png') }}" alt="entry door image">
        <h1>Welcome to SecureGate</h1>
        <p>Please enter your details to get started.</p>

        @if ($errors->any())
            <div class="alert-error">
                <i class="fa-solid fa-circle-exclamation"></i>
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('signup.process') }}" method="POST">
            @csrf

            <span class="dynamic-label-span">Name</span>
            <input type="text" name="full_name"
                   placeholder="Adam"
                   value="{{ old('full_name') }}"
                   required>

            <span class="dynamic-label-span">Gender</span>
            <select name="gender" required>
                <option value="" disabled {{ old('gender') ? '' : 'selected' }}>Select Gender</option>
                <option value="Male"   {{ old('gender') === 'Male'   ? 'selected' : '' }}>Male</option>
                <option value="Female" {{ old('gender') === 'Female' ? 'selected' : '' }}>Female</option>
            </select>

            <span class="dynamic-label-span" id="dynamic-label">Email</span>
            <input type="email" id="input-email" name="email"
                   placeholder="you@gmail.com"
                   value="{{ old('email') }}"
                   required>

            <span class="dynamic-label-span">Password</span>
            <input type="password" name="password"
                   placeholder="Min. 8 characters"
                   required>

            <span class="dynamic-label-span">Confirm Password</span>
            <input type="password" name="password_confirmation"
                   placeholder="Repeat your password"
                   required>

            <button type="submit" name="submit">Sign Up</button>
        </form>

        <hr>

        <div class="bottom-button-sign" onclick="window.location.href='{{ url('/auth/google') }}'">
            <i class="fab fa-google"></i>
            <a href="{{ url('/auth/google') }}">Sign In with Google</a>
        </div>
        <div class="bottom-button-sign">
            <i class="fas fa-user"></i>
            <a href="{{ route('signin') }}">Have Account?</a>
        </div>
    </nav>

    <script src="{{ asset('JS/sign.js') }}"></script>
</body>
</html>
