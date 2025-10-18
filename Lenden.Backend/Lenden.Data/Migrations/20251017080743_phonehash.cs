using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lenden.Data.Migrations
{
    /// <inheritdoc />
    public partial class phonehash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "phone_hash",
                table: "Users",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_paid_by_user_id",
                table: "Transactions",
                column: "paid_by_user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Users_paid_by_user_id",
                table: "Transactions",
                column: "paid_by_user_id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Users_paid_by_user_id",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_paid_by_user_id",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "phone_hash",
                table: "Users");
        }
    }
}
