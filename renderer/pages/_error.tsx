import { NextPage } from 'next';

interface ErrorProps {
    statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#e5e5e5',
            backgroundColor: '#0d0d0d',
        }}>
            <h1 style={{ fontSize: '48px', margin: 0 }}>
                {statusCode || 'Error'}
            </h1>
            <p style={{ color: '#888', marginTop: '8px' }}>
                {statusCode
                    ? `An error ${statusCode} occurred on server`
                    : 'An error occurred on client'}
            </p>
        </div>
    );
};

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
