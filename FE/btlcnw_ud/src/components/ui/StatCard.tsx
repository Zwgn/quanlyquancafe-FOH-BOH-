import "../../assets/styles/stat-card.css";

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <article className="stat-card">
      <p className="stat-card-title">{title}</p>
      <h3 className="stat-card-value">{value}</h3>
    </article>
  );
};

export default StatCard;
