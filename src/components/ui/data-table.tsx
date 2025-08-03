import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface DataTableProps<T> {
	columns: Array<{
		key: string;
		header: string;
		render?: (item: T) => React.ReactNode;
	}>;
	data: T[];
	loading?: boolean;
}

export function DataTable<T>({
	columns,
	data,
	loading = false,
}: DataTableProps<T>) {
	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<Loader2 className="h-8 w-8 animate-spin" />
				<span className="ml-2">Đang tải dữ liệu...</span>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="flex items-center justify-center p-8 text-muted-foreground">
				Không có dữ liệu
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((column) => (
							<TableHead key={column.key}>{column.header}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((item, index) => (
						<TableRow key={index}>
							{columns.map((column) => (
								<TableCell key={column.key}>
									{column.render
										? column.render(item)
										: (item as any)[column.key]}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
