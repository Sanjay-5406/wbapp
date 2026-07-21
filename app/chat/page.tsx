import RealtimeComponent from './getchat'
import { createClient } from '@/utils/supabase/server'

export default async function Chat() {
    const supabase = await createClient()
    const { data: chat } = await supabase
        .from('chat')
        .select('*')
    console.log(chat)

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error) {
        console.error(error.message)
    }

    return (
        <>
            <div>
                <div style={{justifyItems: "center"}}>
                    <h1 style={{fontSize: "40px"}}>Global Chat</h1>
                    <p>
                        Logged in as: {user?.email ?? 'Guest'}
                    </p>
                </div>
                <br />
                <RealtimeComponent />
            </div>
        </>
    )
}
