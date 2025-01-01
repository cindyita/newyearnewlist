import { Card } from "@chakra-ui/react"

interface CardProps {
  nickname: string;
  resolution: string;
}

export function CardComponent({ nickname, resolution }:CardProps) {
    return (
        <Card.Root className="card">
            <Card.Body gap="2" width="100%">
                <div className="icon"><svg xmlns="http://www.w3.org/2000/svg" height="14" width="15.75" viewBox="0 0 576 512"><path fill="#FFD43B" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg></div>
                <Card.Title mt="2" className="title-question"><span>{nickname}</span> se propone...</Card.Title>
                <Card.Description>
                    <div>
                        <p>{resolution}</p>
                    </div>
                </Card.Description>
            </Card.Body>
        </Card.Root>
    )
}