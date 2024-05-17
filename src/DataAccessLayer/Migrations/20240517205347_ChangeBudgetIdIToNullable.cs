using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccessLayer.Migrations
{
    public partial class ChangeBudgetIdIToNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int?>(
            name: "BudgetId",
            table: "Transfers",
            type: "int",
            nullable: true,
            oldClrType: typeof(int),
            oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
            name: "BudgetId",
            table: "Transfers",
            type: "int",
            nullable: false,
            oldClrType: typeof(int?),
            oldType: "int",
            oldNullable: true);
        }
    }
}
