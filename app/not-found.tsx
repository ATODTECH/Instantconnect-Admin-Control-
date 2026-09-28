import { Metadata, NextPage } from 'next'

export const metadata: Metadata = {
  title: "404 page",
  description: "Page not found",
};

const NotFound = () => {
  return (
    <div className='flex flex-col justify-center items-center w-screen h-screen bg-bg-primary text-app-primary-green font-bold text-8xl gap-2 select-none'>
      <p className='shadow-xl'>404</p>
      <p className='text-4xl'>Page not found</p>
    </div>
  )
}

export default NotFound