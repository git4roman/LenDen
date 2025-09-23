using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lenden.Data.Migrations
{
    /// <inheritdoc />
    public partial class groupentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "created_by",
                table: "groups",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateOnly>(
                name: "created_date",
                table: "groups",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<TimeOnly>(
                name: "created_time",
                table: "groups",
                type: "time(6)",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));

            migrationBuilder.AddColumn<DateOnly>(
                name: "updated_date",
                table: "groups",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<TimeOnly>(
                name: "updated_time",
                table: "groups",
                type: "time(6)",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));

            migrationBuilder.CreateIndex(
                name: "IX_groups_created_by",
                table: "groups",
                column: "created_by");

            migrationBuilder.AddForeignKey(
                name: "FK_groups_Users_created_by",
                table: "groups",
                column: "created_by",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_groups_Users_created_by",
                table: "groups");

            migrationBuilder.DropIndex(
                name: "IX_groups_created_by",
                table: "groups");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "groups");

            migrationBuilder.DropColumn(
                name: "created_date",
                table: "groups");

            migrationBuilder.DropColumn(
                name: "created_time",
                table: "groups");

            migrationBuilder.DropColumn(
                name: "updated_date",
                table: "groups");

            migrationBuilder.DropColumn(
                name: "updated_time",
                table: "groups");
        }
    }
}
