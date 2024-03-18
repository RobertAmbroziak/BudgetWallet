using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccessLayer.Migrations
{
    public partial class AddIsActiveForAllEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "TransferTemplates",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Transfers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Splits",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "RegisterConfirmations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Budgets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "BudgetPeriods",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "BudgetPeriodCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "BudgetCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "TransferTemplates");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Transfers");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Splits");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "RegisterConfirmations");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Budgets");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "BudgetPeriods");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "BudgetPeriodCategories");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "BudgetCategories");
        }
    }
}
