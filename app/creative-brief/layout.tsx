

// imports
import BriefTopBar from '../components/global/brief-top-bar/brief-top-bar';

export default function CreativeBriefLayout({ children }: { children: React.ReactNode }) {

    // the return statement
    return (
        <div className='flex flex-col min-h-screen'>
            {/* <header className='h-16'>
                <BriefTopBar />
            </header> */}
            <main className='flex-1 overflow-y-auto'>
                {children}
            </main>
        </div>
    )
}