interface OrderGeneralProps {
  title: string
  icon: React.ReactElement
  content: React.ReactElement
}

const OrderGeneral = ({ title, icon, content }: OrderGeneralProps) => {
  return (
    <div className="bg-card rounded-lg shadow-md">
      <div className="flex gap-1">
        {icon}
        <span className="text-lg font-medium">{title}</span>
      </div>
      <div className="text-muted-foreground">{content}</div>
    </div>
  )
}

export default OrderGeneral
