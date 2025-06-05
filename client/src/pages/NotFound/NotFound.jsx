export default function NotFound() {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>404 - Page Not Found</h2>
            <p>Sorry, the page you are looking for does not exist.</p>
            <button onClick={() => window.location.href = "/"} >Go to Home</button>
        </div>
    );
}