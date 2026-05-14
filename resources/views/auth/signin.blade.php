<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - SecureGate</title>
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
            <a href="{{ route('signup') }}">Sign Up</a>
        </div>
    </nav>

    <nav class="sign-card" style="margin-top: 40px;">
        <img src="{{ asset('Media/SVG.png') }}" alt="entry door image">
        <h1>Welcome Back</h1>
        <p>Please sign in below:</p>

        @if ($errors->any())
            <div class="alert-error">
                <i class="fa-solid fa-circle-exclamation"></i>
                {{ $errors->first() }}
            </div>
        @endif

        @if (session('status'))
            <div class="alert-success">
                {{ session('status') }}
            </div>
        @endif

        <form action="{{ route('signin.process') }}" method="POST">
            @csrf
            <span class="dynamic-label-span" id="dynamic-label">Email</span>
            <input type="email" id="input-email" name="email"
                   placeholder="you@gmail.com"
                   value="{{ old('email') }}"
                   required>

            <span class="dynamic-label-span">Password</span>
            <input type="password" name="password"
                   placeholder="Enter your password"
                   required>

            <button type="submit" name="submit">Sign In</button>
        </form>

        <hr>

        <div class="bottom-button-sign" onclick="window.location.href='{{ url('/auth/google') }}'">
            <i class="fab fa-google"></i>
            <a href="{{ url('/auth/google') }}">Sign In with Google</a>
        </div>
        <div class="bottom-button-sign">
            <i class="fas fa-user"></i>
            <a href="{{ route('signup') }}">Not Have Account?</a>
        </div>
    </nav>
</body>
</html>
