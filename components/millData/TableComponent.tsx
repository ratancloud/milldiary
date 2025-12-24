import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { MillData } from "@/types/mill-data";
import Link from "next/link";
import { formateIndDate, formatKgRs, formatRs } from "@/lib/helper";
import TableSkelton from "./TableSkelton";
import { Button } from "../ui/button";

interface TableProps {
  loading: boolean;
  isPending: boolean;
  filteredRows: MillData[];
}

const TableComponent = ({ loading, isPending, filteredRows }: TableProps) => {

  const cell =
    "border border-border text-base py-3 px-3 tabular-nums whitespace-nowrap";
  const head =
    "border border-border text-sm font-semibold py-3 px-3 uppercase tracking-wide bg-muted sticky top-0 z-20";

  return (
    <div className="relative max-h-[70vh] overflow-auto">
      <Table className="min-w-max border border-border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead
              className={`${head} sticky left-0 z-30 text-center w-12`}
            >
              #
            </TableHead>

            <TableHead className={head}>Date</TableHead>
            <TableHead className={`${head} text-right`}>Total Cr</TableHead>
            <TableHead className={`${head} text-right`}>Mill</TableHead>
            <TableHead className={`${head} text-right`}>Flour</TableHead>
            <TableHead className={`${head} text-right`}>Oil</TableHead>
            <TableHead className={`${head} text-right`}>Khari</TableHead>

            <TableHead className={`${head} text-right`}>Total Dr</TableHead>
            <TableHead className={`${head} text-right`}>Sarso</TableHead>
            <TableHead className={`${head} text-right`}>Gehum</TableHead>

            <TableHead className={`${head} text-right`}>Bhim</TableHead>
            <TableHead className={`${head} text-right`}>Viswa</TableHead>
            <TableHead className={head}>Staff Desc</TableHead>
            <TableHead className={`${head} text-right`}>Mill Dr</TableHead>
            <TableHead className={head}>Mill Desc</TableHead>
            <TableHead className={`${head} text-right`}>Home Dr</TableHead>
            <TableHead className={head}>Home Desc</TableHead>

            <TableHead className={`${head} text-right bg-muted/80`}>
              Net
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading || isPending ? (
            <TableSkelton />
          ) : filteredRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={18} className="h-64 text-center border">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Search className="h-8 w-8" />
                  <p className="font-medium">No records found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredRows.map((row, index) => {
              const net = row.totalCredit - row.totalDebit;

              return (
                <TableRow
                  key={row.id}
                  className="hover:bg-primary/10 transition-colors"
                >
                  <TableCell
                    className={`${cell} sticky left-0 z-10 bg-background text-center font-medium`}
                  >
                    {index + 1}
                  </TableCell>

                  <TableCell className={cell}>
                    <Button>
                      <Link
                      href={`/mill-data/edit/${row.id}`}
                      className=""
                    >
                      {formateIndDate(row.date)}
                    </Link>
                    </Button>
                  </TableCell>

                  <TableCell className={`${cell} text-right`}>
                    Rs. {formatRs(row.totalCredit)}
                  </TableCell>
                  <TableCell className={`${cell} text-right`}>
                    Rs. {formatRs(row.millCredit)}
                  </TableCell>
                  <TableCell className={`${cell} text-right`}>
                    {formatKgRs(row.flourWeight, row.flourRs)}
                  </TableCell>
                  <TableCell className={`${cell} text-right`}>
                    {formatKgRs(row.oilWeight, row.oilRs)}
                  </TableCell>
                  <TableCell className={`${cell} text-right`}>
                    {formatKgRs(row.khariWeight, row.khariRs)}
                  </TableCell>

                  <TableCell className={`${cell} text-right`}>
                    Rs. {formatRs(row.totalDebit)}
                  </TableCell>
                  <TableCell className={`${cell} text-right`}>
                    {formatKgRs(row.sarsoWeight, row.sarsoRs)}
                  </TableCell>
                  <TableCell className={`${cell} text-right`}>
                    {formatKgRs(row.gehumWeight, row.gehumRs)}
                  </TableCell>

                  <TableCell className={`${cell} text-right`}>
                    Rs. {formatRs(row.staff1Rs)}
                  </TableCell>
                  <TableCell className={`${cell} text-right`}>
                    Rs. {formatRs(row.staff2Rs)}
                  </TableCell>
                  <TableCell className={cell}>
                    {row.staffDescription || "-"}
                  </TableCell>
                  <TableCell className={`${cell} text-right`}>
                    Rs. {formatRs(row.millDebit)}
                  </TableCell>
                  <TableCell className={cell}>
                    {row.millDescription || "-"}
                  </TableCell>
                  <TableCell className={`${cell} text-right`}>
                    Rs. {formatRs(row.homeDebit)}
                  </TableCell>
                  <TableCell className={cell}>
                    {row.homeDescription || "-"}
                  </TableCell>

                  <TableCell className={`${cell} text-right font-semibold`}>
                    Rs. {formatRs(net)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
