import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface PublisherStats {
	total: number;
	active: number;
	inactive: number;
	byCountry: Array<{ country: string; count: number }>;
}

interface PublishersStatsProps {
	stats: PublisherStats;
}

const PublishersStats = ({ stats }: PublishersStatsProps) => {
	return (
		<div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<p className="text-sm font-medium">Tổng số</p>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.total}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<p className="text-sm font-medium">Đang hoạt động</p>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-green-600">
						{stats.active}
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<p className="text-sm font-medium">Không hoạt động</p>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-gray-600">
						{stats.inactive}
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<p className="text-sm font-medium">Quốc gia</p>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.byCountry.length}</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default PublishersStats;
