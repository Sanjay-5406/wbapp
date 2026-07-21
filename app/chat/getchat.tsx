'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type Message = {
  chatid: string
  userid: string
  user: string
  message: string
  created_at: string
}

// 1. Keep the color palette outside the component to preserve memory
const USER_COLORS = [
  "#e74c3c", "#9b59b6", "#f1c40f", "#2ecc71", 
  "#e67e22", "#34495e", "#3498db", "#1abc9c"
];

// 2. Pure helper function: Generates a stable color based on the username string
function getUsernameColor(username: string): string {
  if (!username) return USER_COLORS[0];
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % USER_COLORS.length;
  return USER_COLORS[index];
}

export default function RealtimeComponent() {
  const supabase = createClient()

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [username, setUsername] = useState('Anonymous')

  useEffect(() => {
    async function loadMessages() {
      const { data, error } = await supabase
        .from('chat')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error(error)
        return
      }

      setMessages(data ?? [])
    }

    loadMessages()

    const channel = supabase
      .channel('chat-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat',
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  async function sendMessage() {
    if (!text.trim()) return

    const { error } = await supabase.from('chat').insert({
      user: username,
      message: text,
    })

    if (error) {
      console.error(error)
      return
    }

    setText('')
  }

  return (
    <div style={{ maxWidth: 500, padding: '20px' }}>
      <h2>You will be visible as, </h2>

      <input
        placeholder="Your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{padding: "6px 12px", marginRight: "14px",border: "1px solid white", borderRadius: "12px", display: "inline"}}
      />

      <button 
        onClick={sendMessage}
        style={{backgroundColor:"grey", padding: "6px 12px", border: "1px solid white", borderRadius: "12px", display: "inline"}}
      >Send</button>

      <br />
      <br />
      <hr />
      <br />
      

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((msg) => (
          <div key={msg.chatid}>
            {/* ✅ Safe and Pure: Passing username to get a consistent color */}
            <strong style={{ color: getUsernameColor(msg.user) }}>
              {msg.user}: 
            </strong>
            <p style={{ display: "inline", marginLeft: "6px" }}>
              {msg.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}










































// 'use client'

// import { useEffect, useState } from 'react'
// import { createClient } from '@/utils/supabase/client'

// type Message = {
//   uuid: string
//   user: string
//   message: string
//   created_at: string
// }

// export default function RealtimeComponent() {
//   const supabase = createClient()

//   const [messages, setMessages] = useState<Message[]>([])
//   const [text, setText] = useState('')
//   const [username, setUsername] = useState('Anonymous')

//   useEffect(() => {
//     async function loadMessages() {
//       const { data, error } = await supabase
//         .from('chat')
//         .select('*')
//         .order('created_at', { ascending: true })

//       if (error) {
//         console.error(error)
//         return
//       }

//       setMessages(data ?? [])
//     }

//     loadMessages()

//     const channel = supabase
//       .channel('chat-channel')
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'chat',
//         },
//         (payload) => {
//           setMessages((prev) => [...prev, payload.new as Message])
//         }
//       )
//       .subscribe()

//     return () => {
//       supabase.removeChannel(channel)
//     }
//   }, [supabase])

//   async function sendMessage() {
//     if (!text.trim()) return

//     const { error } = await supabase.from('chat').insert({
//       user: username,
//       message: text,
//     })

//     if (error) {
//       console.error(error)
//       return
//     }

//     setText('')
//   }

//     function GetColor() {
//         const colors = ["red", "purple", "yellow", "green", "pink", "orange", "white", "blue", "grey", "brown"];

//         // 1. Initialize the state properly. 
//         // Whatever you 'return' inside here becomes the initial value of 'color'.
//         const [color, setColor] = useState(() => {
//             return colors[Math.floor(Math.random() * colors.length)];
//         });
//     }


//   return (
//     <div style={{ maxWidth: 500 }}>
//       <h2>Global Chat</h2>

//       <input
//         placeholder="Your name"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />

//       <br />
//       <br />

//       <input
//         placeholder="Type a message..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       <button onClick={sendMessage}>Send</button>

//       <hr />

//       {messages.map((msg) => (
//         <div key={msg.uuid}>
//           <strong style={{color: GetColor()}}>{msg.user}: </strong>
//           <p style={{display: "inline", marginLeft: "6px"}}>{msg.message}</p>
//           <br />
//         </div>
//       ))}
//     </div>
//   )
// }
