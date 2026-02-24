import { Routes, Route } from 'react-router-dom'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BlogList />} />
      <Route path="/posts/:slug" element={<BlogPost />} />
      {/* Legacy slug routes without /posts/ prefix */}
      <Route path="/:slug" element={<BlogPost />} />
    </Routes>
  )
}
