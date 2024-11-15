import emptyInbox from '@/assets/images/EmptyInbox.png'

type EmptyProps = {
  title: string
  description: string
  icon?: string
}
const Empty = ({ title, description, icon }: EmptyProps) => {
  return (
    <div className="w-full flex flex-col space-y-4 justify-center align-middle">
      <div className="flex justify-center align-middle">
        <img src={icon ? icon : emptyInbox} className="object-contain" />
      </div>
      <div className="flex flex-col space-y-2">
        <h2 className="font-semibold text-primary text-center text-lg">{title}</h2>
        <p className="text-gray-600 text-center">{description}</p>
      </div>
    </div>
  )
}

export default Empty
